import { Pool } from 'pg';
import ApiLogger from './logger';

const pool = new Pool();

/** Returns the response of a provided query. */
const query = async (queryText: string) => {
  const startTime = Date.now();
  const response = await pool.query(queryText, []);
  const duration = Date.now() - startTime;
  ApiLogger.info(`Executed a new query in ${duration}ms`);
  return response;
};

/** Returns an available client from the pool. */
const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export { query, getClient };
