import * as path from 'path';
import { createPool } from 'generic-pool';
import { Client } from 'ts-postgres';

import * as dotenv from 'dotenv';
dotenv.config({ 
    path: path.resolve(__dirname, `..${path.sep}..${path.sep}..${path.sep}.env`) 
});
const DB_HOST = (process.env.POSTGRES_HOST ? process.env.POSTGRES_HOST : 'localhost');
const DB_PORT = parseInt(process.env.POSTGRES_PORT ? process.env.POSTGRES_PORT : '5432');
const DB_DATABASE = (process.env.POSTGRES_DATABASE ? process.env.POSTGRES_DATABSASE : 'projekt_monsterz');
const DB_USERNAME = (process.env.POSTGRES_USERNAME ? process.env.POSTGRES_USERNAME : 'postgres');
const DB_PASSWORD = (process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : '');

const pgPool = createPool({
    create: async () => {
        const client = new Client({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USERNAME,
            database: DB_DATABASE,
            password: DB_PASSWORD
        });
        return client.connect().then(() => {
            client.on('error', console.log);
            return client;
        });
    },
    destroy: async (client: Client) => {
        return client.end().then(() => { });
    },
    validate: (client: Client) => {
        return Promise.resolve(!client.closed);
    }
}, { testOnBorrow: true });

export { pgPool };
