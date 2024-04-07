// import { drizzle } from 'drizzle-orm/planetscale-serverless';
// import { connect } from '@planetscale/database';

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";


import {
    DATABASE_HOST,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
} from '../env';

// Create fetch-isr
// const fetchISR = (input: string, options?: RequestInit | undefined) => {
//     if (options) {
//         delete options['cache'];
//         //@ts-ignore
//         options['next'] = { revalidate: 43200 };
//     }
//     return fetch(input, options);
// };

// const connection = connect({
//     fetch: fetchISR,
//     host: DATABASE_HOST,
//     username: DATABASE_USERNAME,
//     password: DATABASE_PASSWORD,
// });

const connection = await mysql.createConnection({
    host: DATABASE_HOST,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    port: 3306,
    database: "the_gazelle",
    ssl: {
        rejectUnauthorized: false,
    },
});


export const db = drizzle(connection);
