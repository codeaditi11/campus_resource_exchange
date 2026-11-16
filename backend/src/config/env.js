const dotenv = require("dotenv");
const path = require("path");

// Load .env from project root
dotenv.config({
    path: path.resolve(__dirname, "../../.env")
});

// Validate required environment variables
const requiredVariables = [
    "PORT",
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD"
];

const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable]
);

if (missingVariables.length > 0) {
    throw new Error(
        `Missing environment variables: ${missingVariables.join(", ")}`
    );
}

// Export configuration
const env = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",

    DB_HOST: process.env.DB_HOST,
    DB_PORT: Number(process.env.DB_PORT),
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,

    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173"
};

module.exports = env;