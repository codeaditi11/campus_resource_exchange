// Load environment configuration first
const env = require("./config/env");

const app = require("./app");
const { connectDB, pool } = require("./config/db");

// Start backend server
const startServer = async () => {
    try {

        // Connect to PostgreSQL
        await connectDB();

        // Start Express server
        const server = app.listen(env.PORT, () => {
            console.log("------------------------------------");
            console.log("Campus Resource Exchange Backend");
            console.log("------------------------------------");
            console.log(`Environment: ${env.NODE_ENV}`);
            console.log(`Server running on port: ${env.PORT}`);
            console.log(`URL: http://localhost:${env.PORT}`);
            console.log("------------------------------------");
        });

        // Graceful shutdown
        const shutdown = async () => {
            console.log("Shutting down server...");

            server.close(async () => {
                await pool.end();

                console.log("Server and database connections closed.");
                process.exit(0);
            });
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);

    } catch (error) {
        console.error("Failed to start server:", error.message);
        await pool.end();
        process.exit(1);
    }
};

startServer();