import {
    db,
    Issues,
    Categories,
    IssuesCategoriesOrder,
    wrapCache,
} from '../common';

import { eq, isNotNull, desc } from 'drizzle-orm/expressions';

type Issue = {
    id: number;
    issueNumber: number;
    issueName: string;
    publishedAt: string | null;
}

export type IssueArchive = {
    issueNumber: number;
    issueName: string;
    publishedAt: string | null; 
}
// NOTE - Caching is per request
export const getLatestPublishedIssue = wrapCache(async () => {
    // get the latest issue id
    const issue = await db.select({
        id: Issues.id,
        issueNumber: Issues.issueNumber,
        issueName: Issues.name,
        publishedAt: Issues.published_at,
    })
        .from(Issues)
        .where(isNotNull(Issues.published_at))
        // .where(lte(Issues.published_at, (new Date()).toISOString()))
        .orderBy(desc(Issues.id))
        .limit(1)

    // ensure we have an issue
    if (!issue.length) {
        throw new Error('Issue not found');
    }

    return fetchCategories(issue[0]);
});

export const getIssue = wrapCache(async (issueNumber: number) => {
    const issue = await db.select({
        id: Issues.id,
        issueNumber: Issues.issueNumber,
        issueName: Issues.name,
        publishedAt: Issues.published_at,
    })
        .from(Issues)
        .where(isNotNull(Issues.published_at))
        .where(eq(Issues.issueNumber, issueNumber))
        .limit(1);

    // ensure we have an issue
    if (!issue.length) {
        throw new Error('Issue not found');
    }

    return fetchCategories(issue[0]);
});

export const fetchCategories = wrapCache(async (issue: Issue) => {
    const issueCategories = await db.select({
        id: Categories.id,
        name: Categories.name,
        slug: Categories.slug,
    })
        .from(IssuesCategoriesOrder)
        .where(eq(IssuesCategoriesOrder.issueId, issue.id))
        .innerJoin(Categories, eq(Categories.id, IssuesCategoriesOrder.categoryId))
        .orderBy(IssuesCategoriesOrder.categoriesOrder);

    // return the issue with the categories
    return {
        id: issue.id,
        issueNumber: issue.issueNumber,
        issueName: issue.issueName,
        publishedAt: issue.publishedAt,
        categories: issueCategories
    }
});

export const getIssueArchive = wrapCache(async () => {
    const issues = await db.select({
        issueNumber: Issues.issueNumber,
        issueName: Issues.name,
        publishedAt: Issues.published_at,
    })
        .from(Issues)
        .where(isNotNull(Issues.published_at))
        .orderBy(desc(Issues.id));

    return issues;
});