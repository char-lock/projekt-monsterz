import { Pool, QueryResult } from 'pg';
import ApiLogger from './logger';

const pool = new Pool();

/** Returns the response of a provided query. */
const query = async (queryText: string): Promise<QueryResult<any>> => {
  try {
    const startTime = Date.now();
    const response = await pool.query(queryText, []);
    const duration = Date.now() - startTime;
    ApiLogger.info(`Executed a new query in ${duration}ms`);
    return response;
  } catch (err) {
    ApiLogger.error('Error encountered while trying to connect to database.\n'+err);
    return {rows: [], command: queryText, rowCount: 0, oid: -1, fields: []};
  }
};

/** Returns an available client from the pool. */
const getClient = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (err) {
    ApiLogger.error('Error encountered while trying to connect to database.\n'+err);
    return;
  }
};

export { query, getClient };
