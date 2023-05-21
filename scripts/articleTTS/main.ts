import fs from 'fs';
import util from 'util';
import { eq, and, notInArray } from 'drizzle-orm/expressions';
import { db } from '../../db/conn';
import {
    articles as Articles,
    articlesAudio as ArticlesAudio,
    issues as Issues,
    issuesArticlesOrder as IssuesArticlesOrder,
} from '../../db/schema';
// Import the necessary modules
import { Parser } from 'commonmark';

const writeFile = util.promisify(fs.writeFile);

function parseMarkdown(text: string) {
    // Create a CommonMark reader and writer
    const reader = new Parser();
    const parsed = reader.parse(text);

    let walker = parsed.walker();
    let event, node;

    let sentences = [];
    while ((event = walker.next())) {
        node = event.node;
        if (event.entering && node.type === 'text') {
            //@ts-ignore
            sentences.push(node.literal);
        }
    }

    return sentences.join(' ').replace(/\s{2,}/g, ' ');
}

// Function to split text into sentences
function splitSentences(text: string) {
    return text.match(/[^.!?]+[.!?]+/g) || [];
}

async function getArticlesForIssueNoAudio(issueNumber: number) {
    // get the issue id
    const issueId = db.select({
        id: Issues.id,
    })
        .from(Issues)
        .where(eq(Issues.issueNumber, issueNumber))
        .limit(1);

    // get audio articles
    const audioArticles = db.select({
        id: ArticlesAudio.articleId,
    }) 
        .from(ArticlesAudio);

    // get articles for the issue
    const articles = await db.select({
        id: Articles.id,
        title: Articles.title,
        type: IssuesArticlesOrder.type,
    })
        .from(IssuesArticlesOrder)
        .innerJoin(Articles, eq(IssuesArticlesOrder.articleId, Articles.id))
        .where(and(
            eq(IssuesArticlesOrder.issueId, issueId),
            notInArray(Articles.id, audioArticles),
        ));

    return articles;
}

async function getArticleContent(slug: string) {
    const articleId = await db.select({
        id: Articles.id,
        markdown: Articles.markdown,
        title: Articles.title,
        teaser: Articles.teaser,
    })
        .from(Articles)
        .where(eq(Articles.slug, slug))
        .limit(1);

    if (!articleId)
        throw new Error(`Article with slug ${slug} not found`);
    if (!articleId[0])
        throw new Error(`Article with slug ${slug} not found`);

    if (articleId[0].markdown == null)
        throw new Error(`Article with slug ${slug} has no markdown`);

    return {
        id: articleId[0].id,
        markdown: articleId[0].markdown,
        title: articleId[0].title,
        teaser: articleId[0].teaser,
    }
}

async function updateDB({ id, slug }: { id: number, slug: string }) {
    await db.insert(ArticlesAudio)
        .values({
            articleId: id,
            uri: `https://audio.thegazelle.org/${slug}.mp3`,
        })
        .execute();
}

const bucketName = 'articles-audio';
const slug = 'karl-lagerfeld-met-gala-2023';
const outputFilename = `${slug}.mp3`;

// console.log("Fetching content...");
// const { id, markdown, title, teaser } = await getArticleContent(slug);
// console.log(`got content: ${id}`);

const articles = await getArticlesForIssueNoAudio(248);

console.log(`got articles: ${articles.length}`);
console.log(`got articles: ${JSON.stringify(articles)}`);

// const content = `${title} ${teaser} ${parseMarkdown(markdown)}`;