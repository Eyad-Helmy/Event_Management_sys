const mysql = require("mysql2/promise");
require("dotenv").config(); // Load environment variables from .env file

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Connection successful!");
        connection.release();
        return true;
    } catch (error) {
        console.log("Failed to connect to database:", error);
        return false;
    }
};
// testConnection();
module.exports = {
    pool,
    testConnection
};