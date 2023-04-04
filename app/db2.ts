import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { 
    articles as Articles, 
    issues as Issues, 
    categories as Categories, 
    issuesCategoriesOrder as IssuesCategoriesOrder, 
    issuesArticlesOrder as IssuesArticlesOrder, 
    authorsArticles as AuthorsArticles, 
    staff as Staff,
    semesters as Semesters,
    teams as Teams,
    teamsStaff as TeamsStaff,
} from '../migrations/schema';
import { eq, isNotNull, desc, lte } from 'drizzle-orm/expressions';

import {
    ArticlePreview,
    Category,
    AuthorProfile,
    AuthorPreview,
    AuthorArticle
} from '../components/articles';
import {
    UNCATEGORIZED_CATEGORY_ID,
    UNCATEGORIZED_CATEGORY_NAME,
    UNCATEGORIZED_CATEGORY_SLUG, 
    DEFAULT_STAFF_TITLE,
    DEFAULT_STAFF_BIO,
    DEFAULT_STAFF_IMAGE,
    DEFAULT_STAFF_ORDER,
    DEFAULT_ARTICLE_IMAGE,
    DEFAULT_ARTICLE_TEASER,
} from './env';

// Utility type
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

const UNCATEGORIZED_CATEGORY: Category = { id: UNCATEGORIZED_CATEGORY_ID, name: UNCATEGORIZED_CATEGORY_NAME, slug: UNCATEGORIZED_CATEGORY_SLUG };

const connection = connect({
    host: process.env['DATABASE_HOST'],
    username: process.env['DATABASE_USERNAME'],
    password: process.env['DATABASE_PASSWORD'],
});

const db = drizzle(connection);

// TODO - split into separate files (if needed) 
// NOTE - Caching is per request

export async function getLatestPublishedIssue() {
    // get the latest issue id
    const issue = await db.select({
        id: Issues.id,
        issueNumber: Issues.issueNumber,
        issueName: Issues.name,
        publishedAt: Issues.published_at,
    })
        .from(Issues)
        .where(isNotNull(Issues.published_at))
        .where(lte(Issues.published_at, (new Date()).toISOString()))
        .orderBy(desc(Issues.id))
        .limit(1)

    // ensure we have an issue
    if (!issue.length) {
        throw new Error('Issue not found');
    }

    const issueCategories = await db.select({
        id: Categories.id,
        name: Categories.name,
        slug: Categories.slug,
    })
        .from(IssuesCategoriesOrder)
        .where(eq(IssuesCategoriesOrder.issueId, issue[0].id))
        .innerJoin(Categories, eq(Categories.id, IssuesCategoriesOrder.categoryId))
        .orderBy(IssuesCategoriesOrder.categoriesOrder);
    
    const issueWithCategories = {
        id: issue[0].id,
        issueNumber: issue[0].issueNumber,
        issueName: issue[0].issueName,
        publishedAt: issue[0].publishedAt,
        categories: issueCategories
    }

    return issueWithCategories;
}

// export async function getIssue(issueId: number) {
//     const issue = await db.select({
//         id: Issues.issueNumber,
//         issueNumber: Issues.issueNumber,
//         issueName: Issues.name,
//         publishedAt: Issues.published_at,
// })
//         .from(Issues)
//         .innerJoin(IssuesCategoriesOrder, eq(Issues.id, IssuesCategoriesOrder.issueId))
//         .where(isNotNull(Issues.published_at))
//         .where(eq(Issues.id, issueId))
//         .limit(1);

//     // ensure we have an issue
//     if (!issue.length) {
//         throw new Error('Issue not found');
//     }

//     // get the categories for the issue
//     const issueCategories = await db.select({
//         id: Categories.id,
//         name: Categories.name,
//         slug: Categories.slug,
//     })
//         .from(Categories)
//         .innerJoin(IssuesCategoriesOrder, eq(Categories.id, IssuesCategoriesOrder.categoryId))
//         .where(eq(IssuesCategoriesOrder.issueId, issue[0].id))
//         .orderBy(IssuesCategoriesOrder.categoriesOrder);

//     const issueWithCategories = {
//         id: issue[0].id,
//         issueNumber: issue[0].issueNumber,
//         issueName: issue[0].issueName,
//         publishedAt: issue[0].publishedAt,
//         categories: issueCategories,
//     }

//     return issueWithCategories;
// };

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

export async function getStaff({ slug }: { slug: string }): Promise<AuthorProfile> {
    // This is an expensive query, so we will cache the result for at least 1 hour
    console.log("getStaff", slug);
    const staff = await db.select({
        id: Staff.id,
        name: Staff.name,
        slug: Staff.slug,
        title: Staff.jobTitle,
        image: Staff.imageUrl,
        bio: Staff.biography,
    })
        .from(Staff)
        .where(eq(Staff.slug, slug))
        .limit(1);

    // error if no staff member found
    if (!staff.length) {
        throw new Error('Staff member not found');
    };

    const staffArticles = await db.select({
        issue: Issues.issueNumber,
        id: Articles.id,
        title: Articles.title,
        slug: Articles.slug,
        teaser: Articles.teaser,
        imageUrl: Articles.imageUrl,
    })
        .from(AuthorsArticles)
        .where(eq(AuthorsArticles.authorId, staff[0].id))
        .innerJoin(Articles, eq(AuthorsArticles.articleId, Articles.id))
        .innerJoin(IssuesArticlesOrder, eq(AuthorsArticles.articleId, IssuesArticlesOrder.articleId))
        .innerJoin(Issues, eq(IssuesArticlesOrder.issueId, Issues.id))

    // dedup articles by id
    const dedupedArticles: AuthorArticle[] = [];
    const uniqueIds = new Set();
    for (const article of staffArticles) {
        // check if article id in set
        if (uniqueIds.has(article.id)) {
            continue;
        }
        // otherwise add to set
        uniqueIds.add(article.id);
        // and add to array
        dedupedArticles.push({
            issue: article.issue,
            title: article.title,
            slug: article.slug,
            image: article.imageUrl || DEFAULT_ARTICLE_IMAGE,
            teaser: article.teaser || DEFAULT_ARTICLE_TEASER,
        });
    }

    return {
        name: staff[0].name,
        slug: staff[0].slug,
        title: staff[0].title || DEFAULT_STAFF_TITLE,
        image: staff[0].image || DEFAULT_STAFF_IMAGE,
        bio: staff[0].bio || DEFAULT_STAFF_BIO,
        articles: dedupedArticles,
    } as const;
};

export async function getLatestStaffRoster(): Promise<AuthorPreview[][]> {
    // get the latest semester
    const latestSemester = db.select({
        id: Semesters.id,
    })
        .from(Semesters)
        .orderBy(desc(Semesters.id))
        .limit(1);

    // use as subquery to get all team members
    const staffRoster = await db.select({
        teamName: Teams.name,
        staffName: Staff.name,
        staffSlug: Staff.slug,
        staffTitle: Staff.jobTitle,
        staffImage: Staff.imageUrl,
        staffOrder: TeamsStaff.staffOrder || 0,
    })
        .from(TeamsStaff)
        .where(eq(TeamsStaff.semesterId, latestSemester))
        .innerJoin(Teams, eq(Teams.id, TeamsStaff.teamId))
        .innerJoin(Staff, eq(Staff.id, TeamsStaff.staffId))
        .orderBy(TeamsStaff.teamOrder);

    // create a mapping
    const teamToStaff: Map<string, AuthorPreview[]> = new Map();
    staffRoster.forEach((staff) => {
        const currentTeam = teamToStaff.get(staff.teamName) || [];
        currentTeam.push({
            teamName: staff.teamName,
            staffName: staff.staffName,
            staffSlug: staff.staffSlug,
            staffTitle: staff.staffTitle || DEFAULT_STAFF_TITLE,
            staffImage: staff.staffImage || DEFAULT_STAFF_IMAGE,
            staffOrder: staff.staffOrder || DEFAULT_STAFF_ORDER,
        });
        teamToStaff.set(staff.teamName, currentTeam);
    });

    // sort staff by order
    teamToStaff.forEach((staffList) => {
        staffList.sort((a, b) => a.staffOrder - b.staffOrder);
    });

    return Array.from(teamToStaff.values());
}
