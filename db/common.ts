import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
export {
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
    articleIllustrations as ArticleIllustrations,
    infoPages as InfoPages,
    articlesAudio as ArticlesAudio,
} from './schema';
import {
    DATABASE_HOST,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    UPSTASH_TOKEN,
    UPSTASH_URL,
} from '../env';
import { cache } from 'react';

// Utility type
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// Create fetch-isr
const fetchISR = (input: string, options?: RequestInit | undefined) => {
    if (options)
        options['cache'] = 'force-cache';
    return fetch(input, options);
};

const connection = connect({
    fetch: fetchISR,
    host: DATABASE_HOST,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
});


export const db = drizzle(connection);

export function wrapCache<T extends (...args: any[]) => any>(fn: T) {
    return cache(async function(...args: Parameters<T>): Promise<UnwrapPromise<ReturnType<T>>> {
        return await fn(...args);
    });
}
