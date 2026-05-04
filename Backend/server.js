const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./utils/db");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");
const todoRoutes = require("./routes/todoRoutes");
const goalRoutes = require("./routes/goalRoutes");
const errorHandler = require("./middlewares/errorMiddleware");

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Auth routes
app.use("/api/auth", authRoutes);

// Notes routes
app.use("/api/notes", notesRoutes);

// Todo routes
app.use("/api/todos", todoRoutes);

// Goal routes
app.use("/api/goals", goalRoutes);

// Error handling middleware
app.use(errorHandler);

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