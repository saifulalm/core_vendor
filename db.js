// db.js

const { Pool } = require('pg');

const pool = new Pool({
    user: 'Saiful',
    host: '127.0.0.1',
    database: 'core_vendor',
    password: '123456',
    port: 5432,
});

module.exports = pool;
