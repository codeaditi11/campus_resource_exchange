const { Pool } = require("pg");
const env = require("./env");

// Create PostgreSQL connection pool
const pool = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,

    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

// Handle unexpected pool errors
pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL pool error:", error.message);
});

// Test database connection
const connectDB = async () => {
    try {
        const result = await pool.query("SELECT NOW()");

        console.log("PostgreSQL connected successfully!");
        console.log("Database time:", result.rows[0].now);

    } catch (error) {
        console.error("PostgreSQL connection failed:", error.message);
        throw error;
    }
};

module.exports = {
    pool,
    connectDB
};