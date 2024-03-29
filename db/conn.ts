import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';

import {
    DATABASE_HOST,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
} from '../env';

// Create fetch-isr
const fetchISR = (input: string, options?: RequestInit | undefined) => {
    if (options) {
        delete options['cache'];
        //@ts-ignore
        options['next'] = { revalidate: 43200 };
    }
    return fetch(input, options);
};

const connection = connect({
    fetch: fetchISR,
    host: DATABASE_HOST,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
});

export const db = drizzle(connection);
