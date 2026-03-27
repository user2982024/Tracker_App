const mongoose = require("mongoose");

const connectDb = async (req, res) => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongo DB connected ${conn.connection.host}`);
    }
    catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
}

module.exports = connectDb;