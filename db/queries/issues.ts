import {
    db,
    Issues,
    Categories,
    IssuesCategoriesOrder,
    wrapUpstash,
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
export const getLatestPublishedIssue = wrapUpstash(async () => {
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
}, 'getLatestPublishedIssue');

export const getIssue = wrapUpstash(async (issueNumber: number) => {
    console.log("getting issue", issueNumber);

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
}, 'getIssue', 3600);

export const fetchCategories = wrapUpstash(async (issue: Issue) => {
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
}, 'fetchCategories', 500);

export const getIssueArchive = wrapUpstash(async () => {
    const issues = await db.select({
        issueNumber: Issues.issueNumber,
        issueName: Issues.name,
        publishedAt: Issues.published_at,
    })
        .from(Issues)
        .where(isNotNull(Issues.published_at))
        .orderBy(desc(Issues.id));

    return issues;
}, 'getIssueArchive', 500);