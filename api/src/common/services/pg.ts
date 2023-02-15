import postgres from 'postgres';

require('dotenv').config({ path: '../../../../.env' });

const sql = postgres({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    database: process.env.POSTGRES_DATABASE || 'projekt_monsterz',
    username: process.env.POSTGRES_USERNAME || 'root',
    password: process.env.POSTGRES_PASSWORD || ''
});

export { sql };
