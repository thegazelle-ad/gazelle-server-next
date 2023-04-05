import { eq } from 'drizzle-orm/expressions';
import { ArticlePreview, Category } from "../../../components/articles";
import { getLatestPublishedIssue } from "./issues";
import { 
    UNCATEGORIZED_CATEGORY_ID,
    UNCATEGORIZED_CATEGORY_NAME,
    UNCATEGORIZED_CATEGORY_SLUG,
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

export async function getIssueArticles(issue: UnwrapPromise<ReturnType<typeof getLatestPublishedIssue>>): Promise<ArticlePreview[][]> {
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
    })
        .from(IssuesArticlesOrder)
        .where(eq(IssuesArticlesOrder.issueId, issue.id))
        .innerJoin(Articles, eq(Articles.id, IssuesArticlesOrder.articleId))
        .innerJoin(AuthorsArticles, eq(Articles.id, AuthorsArticles.articleId))
        .innerJoin(Staff, eq(AuthorsArticles.authorId, Staff.id))
        .orderBy(IssuesArticlesOrder.articleOrder);


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
        };

        articlesWithAuthors.set(article.id, articlePreview);
    });

    // sort into categories
    // articles are already in order by articleOrder from mysql
    const articlesInCategories: Map<number, ArticlePreview[]> = new Map();
    articlesWithAuthors.forEach((article) => {
        const currentArticles = articlesInCategories.get(article.category.id) || [];
        // append our article to the end of the array
        currentArticles.push(article);
        // update the map 
        articlesInCategories.set(article.category.id, currentArticles);
    });

    return Array.from(articlesInCategories.values());
};