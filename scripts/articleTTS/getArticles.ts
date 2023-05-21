import { eq, and, notInArray } from 'drizzle-orm/expressions';
import { db } from '../../db/conn';
import {
    articles as Articles,
    articlesAudio as ArticlesAudio,
    issues as Issues,
    issuesArticlesOrder as IssuesArticlesOrder,
} from '../../db/schema';

export async function getArticlesForIssueNoAudio(issueNumber: number) {
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
        slug: Articles.slug,
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

// const articles = await getArticlesForIssueNoAudio(248);