const dotenv = require('dotenv');

// This is very import in purspective of loading dynamic env files.
const NODE_ENV = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${NODE_ENV}` });

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT, DB_DIALECT } = process.env;

const config = {
  development: {
    host: DB_HOST || '127.0.0.1',
    username: DB_USER || '',
    password: DB_PASS || '',
    database: DB_NAME || '',
    port: Number(DB_PORT) || 3306,
    dialect: DB_DIALECT || 'mysql',
  },
  production: {
    host: DB_HOST || '127.0.0.1',
    username: DB_USER || '',
    password: DB_PASS || '',
    database: DB_NAME || 'test',
    port: Number(DB_PORT) || 3306,
    dialect: DB_DIALECT || 'mysql',
  },
};

module.exports = config;
