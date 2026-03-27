const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./utils/db");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
    // connect DB first
    await connectDB(); 

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();