import { Pool } from 'pg';
import { APILogger } from './api.logger';

const pool = new Pool();
const logger = new APILogger();

async function query(text: string, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.info('Executed a query: ', { text, duration, rows: res.rowCount });
    return res;
}

async function getClient() {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;

    // Set a timeout of 5 seconds before logging the last query.
    // const timeout = setTimeout(() => {
    //     logger.error('A client has been checked out for more than 5 seconds.');
    //     logger.error(`The last executed query on that client was: ${client['lastQuery']}`);
    // }, 5000);

    // Monkey patch the query method in order to track the last query executed.
    // client.query = (...args) => {
    //     client['lastQuery'] = args;
    //     return query.apply(client, args);
    // }
    // client.release = () => {
    //     clearTimeout(timeout);
    //     client.query = query;
    //     client.release = release;
    //     return release.apply(client);
    // }
    return client;
}

export { query, getClient }