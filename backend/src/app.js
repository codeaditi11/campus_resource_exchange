const express = require("express");
const cors = require("cors");

const { pool } = require("./config/db");
const env = require("./config/env");

const app = express();

// ==============================
// MIDDLEWARE
// ==============================

app.use(cors({
    origin: env.CLIENT_URL
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ==============================
// HOME ROUTE
// ==============================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Campus Resource Exchange API"
    });
});

// ==============================
// DATABASE HEALTH CHECK
// ==============================

app.get("/api/health", async (req, res, next) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.status(200).json({
            success: true,
            message: "Backend and PostgreSQL are working!",
            databaseTime: result.rows[0].now
        });

    } catch (error) {
        next(error);
    }
});

// ==============================
// 404 HANDLER
// ==============================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// ==============================
// GLOBAL ERROR HANDLER
// ==============================

app.use((error, req, res, next) => {
    console.error("Server Error:", error);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

module.exports = app;

