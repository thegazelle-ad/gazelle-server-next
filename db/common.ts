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
import { Redis } from '@upstash/redis';
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

const redis = new Redis({
    url: UPSTASH_URL,
    token: UPSTASH_TOKEN,
})

export const db = drizzle(connection);

export function wrapUpstash<T extends (...args: any[]) => any>(fn: T, functionKey: string, ttl: number = 500) {
    return cache(async function(...args: Parameters<T>): Promise<UnwrapPromise<ReturnType<T>>> {
        const cacheKey = functionKey + JSON.stringify(args);

        // let cached = null;
        // try {
        //     cached = await redis.get(cacheKey);

        //     if (cached) {
        //         // console.log("Cache hit: ", cacheKey);
        //         return cached as UnwrapPromise<ReturnType<T>>;
        //     } else {
        //         // console.log("Cache miss: ", cacheKey);
        //     }
        // } catch (e) {
        //     console.error("Unable to reach upstash: ", e);
        // }

        const result = await fn(...args);

        // if (cached == null && result) {
        //     try {
        //         // todo - send this off as a background task - we don't need to wait for it
        //         redis.set(cacheKey, result, { ex: ttl}).then(() => console.log("Set redis cache"));
        //     } catch (e) {
        //         console.error("Unable to reach upstash: ", e);
        //     }
        // }

        return result;
    });
}
