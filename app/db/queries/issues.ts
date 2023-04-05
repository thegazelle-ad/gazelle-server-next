import {
    db,
    Issues,
    Categories,
    IssuesCategoriesOrder
} from '../common';

import { eq, isNotNull, desc, lte } from 'drizzle-orm/expressions';

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
