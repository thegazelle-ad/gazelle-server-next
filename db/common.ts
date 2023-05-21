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
export { db } from './conn';
import { cache } from 'react';

// Utility type
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export function wrapCache<T extends (...args: any[]) => any>(fn: T) {
    return cache(async function(...args: Parameters<T>): Promise<UnwrapPromise<ReturnType<T>>> {
        return await fn(...args);
    });
}
