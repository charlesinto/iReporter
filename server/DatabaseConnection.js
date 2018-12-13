import pg from 'pg';
/**
 * Creates a connection to database.
 *
 *
 * @author: charles onuorah
 *
 *
 */
require('dotenv').config();

let pool;
if (process.env.NODE_ENV === 'DEVELOPMENT') {
    pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
} else if (process.env.NODE_ENV === 'TEST') {
    pool = new pg.Pool({
        connectionString: process.env.HEROKU_POSTGRESQL_GRAY_URL,
        ssl: true,
    });
} else {
    pool = new pg.Pool({
        connectionString: process.env.HEROKU_POSTGRESQL_WHITE_URL, ssl: true,
    });
}
export default pool;
