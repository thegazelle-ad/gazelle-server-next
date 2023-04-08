import { eq } from 'drizzle-orm/expressions';
import { 
    ArticlePreview,
    Category,
    IssueArticles,
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
} from "../../env";
import { 
    UnwrapPromise,
    Articles,
    IssuesArticlesOrder,
    AuthorsArticles,
    Staff,
    db,
} from "../common";

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
        trending: trendingArticles.slice(0,6),
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
        publishedAt: Articles.publishedAt
    })
        .from(Articles)
        .where(eq(Articles.slug, slug))
        .limit(1);

    if (!article)
        throw new Error('Article not found!');

    if (!article[0].markdown)
        throw new Error('Article missing content!');    


    // get authors
    const authors = await db.select({
        name: Staff.name,
        slug: Staff.slug,
    })
        .from(AuthorsArticles)
        .where(eq(AuthorsArticles.articleId, article[0].id))
        .innerJoin(Staff, eq(AuthorsArticles.authorId, Staff.id))
        .limit(1);
    
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
    }

}
