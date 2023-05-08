import { eq, ne, desc, inArray, gte, and } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';
import { 
    ArticlePreview,
    Category,
    IssueArticles,
    ArticleStack,
    ArticleList,
    ArticlePage,
    Author
} from "../../components/articles";
import { getLatestPublishedIssue } from "./issues";
import { 
    UNCATEGORIZED_CATEGORY_ID,
    UNCATEGORIZED_CATEGORY_NAME,
    UNCATEGORIZED_CATEGORY_SLUG,
    ARTICLE_TYPE_FEATURED,
    ARTICLE_TYPE_EDITORS_PICKS,
    ARTICLE_TYPES,
    ARTICLE_DEFAULT_IMAGE,
    ARTICLE_DEFAULT_PUBLISHED_AT,
    ARTICLE_DEFAULT_TEASER,
    DATABASE_DATE_TIME_FORMAT,
} from "../../env";
import { 
    UnwrapPromise,
    Articles,
    IssuesArticlesOrder,
    AuthorsArticles,
    Staff,
    db,
    Issues,
    Categories,
    ArticlesAudio,
} from "../common";
import { format } from 'date-fns';

export const UNCATEGORIZED_CATEGORY: Category = { id: UNCATEGORIZED_CATEGORY_ID, name: UNCATEGORIZED_CATEGORY_NAME, slug: UNCATEGORIZED_CATEGORY_SLUG };

export async function getIssueArticles(issue: UnwrapPromise<ReturnType<typeof getLatestPublishedIssue>>): Promise<IssueArticles> {
    // Fetch authors and articles in separate queries to reduce payload size
    const latestIssueArticles = await db.select({
        id: Articles.id,
        title: Articles.title,
        slug: Articles.slug,
        teaser: Articles.teaser,
        // todo - issueId
        imageUrl: Articles.imageUrl,
        // markdown: Articles.markdown,
        categoryId: Articles.categoryId,
        articleOrder: IssuesArticlesOrder.articleOrder,
        author: Staff.name,
        authorSlug: Staff.slug,
        // to get featured,editors picks
        type: IssuesArticlesOrder.type,
        // to get trending
        views: Articles.views,
    })
        .from(IssuesArticlesOrder)
        .where(eq(IssuesArticlesOrder.issueId, issue.id))
        .innerJoin(Articles, eq(Articles.id, IssuesArticlesOrder.articleId))
        .innerJoin(AuthorsArticles, eq(Articles.id, AuthorsArticles.articleId))
        .innerJoin(Staff, eq(AuthorsArticles.authorId, Staff.id))
        .orderBy(IssuesArticlesOrder.articleOrder);

    // ensure we have atleast 4 articles
    if (latestIssueArticles.length < 4) {
        throw new Error('Not enough articles to render issue');
    }

    // map the id to the category type
    const idToCategory: Map<number, Category> = new Map();
    issue.categories.forEach((category) => {
        idToCategory.set(category.id, category);
    });
    // Last category in the map (last to be rendered on page too)
    idToCategory.set(UNCATEGORIZED_CATEGORY_ID, UNCATEGORIZED_CATEGORY);

    // merge authors
    const articlesWithAuthors: Map<number, ArticlePreview> = new Map();
    latestIssueArticles.forEach((article) => {
        // TODO- handle missing gracefully
        if (!article.title) throw new Error('Article missing title');
        if (!article.slug) throw new Error('Article missing slug');
        if (!article.teaser) throw new Error('Article missing teaser');
        if (!article.imageUrl) throw new Error('Article missing image_url');
        if (article.type > 3 || article.type < 0) throw new Error('Article missing type');

        // check if article id in map
        const existingArticle = articlesWithAuthors.get(article.id);
        if (existingArticle) {
            // add author to existing article
            existingArticle.authors.push({
                name: article.author,
                slug: article.authorSlug,
            });
            return;
        }

        // otherwise create a new article
        const articlePreview: ArticlePreview = {
            issue: issue.issueNumber,
            title: article.title,
            slug: article.slug,
            image: article.imageUrl,
            teaser: article.teaser,
            category: idToCategory.get(article.categoryId || UNCATEGORIZED_CATEGORY_ID) || UNCATEGORIZED_CATEGORY,
            articleOrder: article.articleOrder,
            authors: [{
                name: article.author,
                slug: article.authorSlug,
            }],
            type: article.type as ARTICLE_TYPES,
            views: article.views,
        };

        articlesWithAuthors.set(article.id, articlePreview);
    });

    // sort into categories
    // articles are already in order by articleOrder from mysql
    const articlesInCategories: Map<number, ArticlePreview[]> = new Map();
    articlesWithAuthors.forEach((article) => {
        const currentArticles = articlesInCategories.get(article.category.id) || [];
        // ignore if featured or editors picks
        if (article.type === ARTICLE_TYPE_FEATURED || article.type === ARTICLE_TYPE_EDITORS_PICKS)
            return;

        // append our article to the end of the array
        currentArticles.push(article);
        // update the map 
        articlesInCategories.set(article.category.id, currentArticles);
    });

    // sort by views (in place)
    // this could be improved by using a quicksort and then O(n) to get the top k articles
    // but this is fine for now
    const trendingArticles: ArticlePreview[] = Array.from(articlesWithAuthors.values());
    trendingArticles.sort((a, b) => b.views - a.views);
    let editorsPicks: ArticlePreview[] = [];
    let featured: ArticlePreview | undefined;
    trendingArticles.map((article) => {
        if (article.type === ARTICLE_TYPE_FEATURED) {
            featured = article;
        } else if (article.type === ARTICLE_TYPE_EDITORS_PICKS) {
            editorsPicks.push(article);
        }
    });
    // if featured is undefined, use the first trending article
    // this should be tested
    if (featured === undefined) {
        featured = trendingArticles[0];
    };
    if (editorsPicks.length === 0) {
        editorsPicks = trendingArticles.slice(1, 4);
    }

    return {
        allCategories: Array.from(articlesInCategories.values()),
        featured,
        trending: trendingArticles.slice(0,4),
        editorsPicks,
    }
};

export async function getArticle(slug: string): Promise<ArticlePage> {
    const article = await db.select({
        id: Articles.id,
        title: Articles.title,
        teaser: Articles.teaser,
        markdown: Articles.markdown,
        imageUrl: Articles.imageUrl,
        views: Articles.views,
        publishedAt: Articles.publishedAt,
        categoryId: Articles.categoryId,
    })
        .from(Articles)
        .where(eq(Articles.slug, slug))
        .limit(1);

    if (!Array.isArray(article) || article.length === 0)
        throw new Error('Article not found!');

    if (!article[0].markdown)
        throw new Error('Article missing content!');    

    // attempt to get audio
    const audioUri = await db.select({
        uri: ArticlesAudio.uri,
    })
        .from(ArticlesAudio)
        .where(eq(ArticlesAudio.articleId, article[0].id))
        .limit(1);

    // get authors
    const authors = await db.select({
        name: Staff.name,
        slug: Staff.slug,
    })
        .from(AuthorsArticles)
        .where(eq(AuthorsArticles.articleId, article[0].id))
        .innerJoin(Staff, eq(AuthorsArticles.authorId, Staff.id));
    
    if (!authors)
        throw new Error('Article missing authors');

    // fire off a view
    try {
        db.update(Articles)
            .set({ views: article[0].views + 1 })
            .where(eq(Articles.id, article[0].id))
            .execute();
    } catch (e) {
        console.error('Failed to increment article views', e);
    }

    return {
        title: article[0].title,
        image: article[0].imageUrl || ARTICLE_DEFAULT_IMAGE,
        teaser: article[0].teaser || ARTICLE_DEFAULT_TEASER,
        markdown: article[0].markdown,
        publishedAt: article[0].publishedAt || ARTICLE_DEFAULT_PUBLISHED_AT,
        authors: authors as Author[],
        categoryId: article[0].categoryId || UNCATEGORIZED_CATEGORY_ID,
        audioUri: Array.isArray(audioUri) && audioUri.length > 0 ? audioUri[0].uri : undefined,
    } as const;

}

// TODO - to be replaced by a better algorithm with openai embeddings
export async function getRelatedArticles(articleCategoryId: number, articleSlug: string, articlePublishedAt: string): Promise<ArticleList[]> {
    const relatedArticles = await db.select({
        id: Articles.id,
        issue: Issues.issueNumber,
        title: Articles.title,
        slug: Articles.slug,
        image: Articles.imageUrl,
        teaser: Articles.teaser,      
    })
        // TODO - this algorithm could be a lot better
        // experiment with other solutions
        .from(Articles)
        .where(eq(Articles.categoryId, articleCategoryId))
        .where(ne(Articles.slug, articleSlug))
        .where(ne(Articles.publishedAt, articlePublishedAt))
        .innerJoin(IssuesArticlesOrder, eq(Articles.id, IssuesArticlesOrder.articleId))
        .innerJoin(Issues, eq(IssuesArticlesOrder.issueId, Issues.id))
        .orderBy(desc(Articles.publishedAt))
        .limit(2);

    const articlesWithAuthors = await addAuthorsToArticles(relatedArticles);

    return Array.from(articlesWithAuthors.values()) as ArticleList[];
}

export async function getGlobalTrendingArticles() {
    const trendingArticles = await db.select({
        id: Articles.id,
        issue: Issues.issueNumber,
        title: Articles.title,
        slug: Articles.slug,
    })
        .from(Articles)
        .where(gte(Articles.publishedAt, format(new Date(Date.now() - (1000 * 60 * 60 * 24 * 180)), DATABASE_DATE_TIME_FORMAT)))
        .innerJoin(IssuesArticlesOrder, eq(Articles.id, IssuesArticlesOrder.articleId))
        .innerJoin(Issues, eq(IssuesArticlesOrder.issueId, Issues.id))
        .orderBy(desc(Articles.views))
        .limit(6);

    if (!trendingArticles || trendingArticles.length === 0)
        throw new Error('No trending articles found!');

    const articlesWithAuthors = await addAuthorsToArticles(trendingArticles);

    return Array.from(articlesWithAuthors.values()) as ArticleStack[];
}

export async function searchArticles(query: string): Promise<ArticleList[]> {
    // Task 1 - Search for authors
    const relatedAuthors = await db.select({
        id: Articles.id,
        relevancy: sql<number>`MATCH (name) AGAINST (${query} IN NATURAL LANGUAGE MODE) AS relevance`,
    })
        .from(Staff)
        .where(sql`MATCH (name) AGAINST (${query} IN NATURAL LANGUAGE MODE)`)
        .innerJoin(AuthorsArticles, eq(AuthorsArticles.authorId, Staff.id))
        .innerJoin(Articles, eq(AuthorsArticles.articleId, Articles.id))
        .orderBy(sql`relevance DESC`)
        .limit(20);

    // Task 2 - Search for content
    const relatedContent = await db.select({
        id: Articles.id,
        relevancy: sql<number>`MATCH (markdown) AGAINST (${query} IN NATURAL LANGUAGE MODE) AS relevance`,
    })
        .from(Articles)
        .where(sql`MATCH (markdown) AGAINST (${query} IN NATURAL LANGUAGE MODE)`)
        .orderBy(sql`relevance DESC`)
        .limit(20);
    
    // Task 3 - Search for article titles
    const relatedTitles = await db.select({
        id: Articles.id,
        relevancy: sql<number>`MATCH (title) AGAINST (${query} IN NATURAL LANGUAGE MODE) AS relevance`,
    })
        .from(Articles)
        .where(sql`MATCH (title) AGAINST (${query} IN NATURAL LANGUAGE MODE)`)
        .orderBy(sql`relevance DESC`)
        .limit(20);
    
    // Sort all results by relevancy
    const allResults = [...relatedAuthors, ...relatedContent, ...relatedTitles];
    allResults.sort((a, b) => b.relevancy - a.relevancy);
    // print results
    const resultIds = allResults.slice(0, 30).map((a) => a.id);

    // If there are no results, return an empty array
    if (resultIds.length === 0)
        return [];

    // Return the most relevant 20 results        
    const results = await db.select({
        id: Articles.id,
        issue: Issues.issueNumber,
        title: Articles.title,
        slug: Articles.slug,
        image: Articles.imageUrl,
        teaser: Articles.teaser,
    })
        .from(Articles)
        .innerJoin(IssuesArticlesOrder, eq(Articles.id, IssuesArticlesOrder.articleId))
        .innerJoin(Issues, eq(IssuesArticlesOrder.issueId, Issues.id))
        .where(inArray(Articles.id, resultIds))
        .orderBy(desc(Articles.publishedAt));

    // fetch the authors
    const articlesWithAuthors = await addAuthorsToArticles(results);

    return Array.from(articlesWithAuthors) as ArticleList[];
}

export async function addAuthorsToArticles<T extends { id: number }>(articles: T[]): Promise<(T & { authors: Author[] })[]> {
    // If there are no articles, return an empty array
    if (articles.length === 0)
        return [];

    // Make a request for the authors
    const authors = await db.select({
        articleId: AuthorsArticles.articleId,
        name: Staff.name,
        slug: Staff.slug,
    })
        .from(AuthorsArticles)
        .innerJoin(Staff, eq(AuthorsArticles.authorId, Staff.id))
        .where(inArray(AuthorsArticles.articleId, articles.map((a) => a.id)));

    // Combine articles and authors (de-duplicating by id)
    const articlesWithAuthors = new Map<number, T & { authors: Author[] }>();
    articles.forEach((article) => {
        articlesWithAuthors.set(article.id, {
            ...article,
            authors: [],
        });
    });
    authors.forEach((author) => {
        const article = articlesWithAuthors.get(author.articleId);
        if (!article)
            throw new Error("Something went wrong when adding authors to articles!");

        article.authors.push({
            name: author.name,
            slug: author.slug,
        } as Author);
    });

    return Array.from(articlesWithAuthors.values());
}

export async function getCategoryArticles(categorySlug: string ) {
    // get latest Issue ID
    const latestIssueId = await db.select({
        id: Issues.id,
    })
        .from(Issues)
        .orderBy(desc(Issues.id))
        .limit(1);

    if (!latestIssueId || latestIssueId.length === 0)
        throw new Error('No issues found!');
    
    // get articles for that issue: where issueId = latestIssueId: where categoryId = 2 (features)
    const articles = await db.select({
        id: Articles.id,
        title: Articles.title,
        issue: Issues.issueNumber,
        slug: Articles.slug,
        teaser: Articles.teaser,
        image: Articles.imageUrl,
        categoryName: Categories.name,
    })
        .from(IssuesArticlesOrder)
        .innerJoin(Articles, eq(Articles.id, IssuesArticlesOrder.articleId))
        .innerJoin(Categories, eq(Categories.id, Articles.categoryId))
        .innerJoin(Issues, eq(Issues.id, IssuesArticlesOrder.issueId))
        .where(
            and(eq(IssuesArticlesOrder.issueId, latestIssueId[0].id), eq(Categories.slug, categorySlug))
        );
    
    // add authors
    const articlesWithAuthors = await addAuthorsToArticles(articles);
    // fill in image, teaser
    articlesWithAuthors.forEach((article) => {
        article.image = article.image ? article.image : '/images/placeholder.png';
        article.teaser = article.teaser ? article.teaser : '';
    });        
    
    return Array.from(articlesWithAuthors) as ArticleList[] & { categoryName: string }[];
}

export async function getLatestTrendingArticles() {
    const trendingArticles = await db.select({
        id: Articles.id,
        issue: Issues.issueNumber,
        title: Articles.title,
        slug: Articles.slug,
        image: Articles.imageUrl,
        teaser: Articles.teaser,
    })
        .from(Articles)
        .where(gte(Articles.publishedAt, format(new Date(Date.now() - (1000 * 60 * 60 * 24 * 90)), DATABASE_DATE_TIME_FORMAT)))
        .innerJoin(IssuesArticlesOrder, eq(Articles.id, IssuesArticlesOrder.articleId))
        .innerJoin(Issues, eq(IssuesArticlesOrder.issueId, Issues.id))
        .orderBy(desc(Articles.views))
        .limit(10);

    if (!trendingArticles || trendingArticles.length === 0)
        throw new Error('No trending articles found!');

    const articlesWithAuthors = await addAuthorsToArticles(trendingArticles);

    return Array.from(articlesWithAuthors.values()) as ArticleList[];
}

export async function getEditorsPicksArticles() {
    const editorsPicks = await db.select({
        id: Articles.id,
        issue: Issues.issueNumber,
        title: Articles.title,
        slug: Articles.slug,
        image: Articles.imageUrl,
        teaser: Articles.teaser,
    })
        .from(Articles)
        .where(eq(IssuesArticlesOrder.type, ARTICLE_TYPE_EDITORS_PICKS))
        .innerJoin(IssuesArticlesOrder, eq(Articles.id, IssuesArticlesOrder.articleId))
        .innerJoin(Issues, eq(IssuesArticlesOrder.issueId, Issues.id))
        .orderBy(desc(Articles.id))
        .limit(10);

    if (!editorsPicks || editorsPicks.length === 0)
        throw new Error('No trending articles found!');

    const articlesWithAuthors = await addAuthorsToArticles(editorsPicks);

    return Array.from(articlesWithAuthors.values()) as ArticleList[];
}
