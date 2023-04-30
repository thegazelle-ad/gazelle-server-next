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
} from './schema';
import {
    DATABASE_HOST,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
} from '../env';

// Utility type
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

const connection = connect({
    host: DATABASE_HOST,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
});

export const db = drizzle(connection);

