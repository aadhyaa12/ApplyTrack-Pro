
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

const db = require("./db");
const applicationRoutes = require("./routes");
const authRoutes = require("./auth");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Check server
app.get("/check", (req, res) => {
    res.send("Main server is working!");
});



// Application routes
app.use("/api/auth", authRoutes);
app.use("/api", applicationRoutes);



// Protected route to test JWT authentication
app.get("/api/auth/protected-test", authMiddleware, (req, res) => {
    res.json({
        message: "Authentication successful!",
        user: req.user
    });
});


// Direct authentication test
app.get("/api/auth/direct-test", (req, res) => {
    res.send("Direct authentication test is working!");
});

// Home route
app.get("/", (req, res) => {
    res.send("ApplyTrack Pro Backend is Running!");
});

// Test database connection
app.get("/test-db", (req, res) => {
    db.query("SELECT 1 AS result", (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database test failed",
                error: err.message
            });
        }

        res.json({
            message: "Database connected successfully!",
            result: results[0].result
        });
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
