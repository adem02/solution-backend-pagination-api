import * as mysql from "mysql2/promise";

export const createDatabaseConnection = async () => {
    return mysql.createConnection({
        host: process.env.DATABASE_URI,
        port: Number(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    });
}


