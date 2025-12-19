const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup Route
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // Hash password
        const hashedPassword =
         await bcrypt.hash(password, 12);

        // Create new user
        const user = await User.create({
            name, 
            email,
            password: hashedPassword
        })

        // Generate JWT token
        const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error("Signup Error", error)
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// Signin Route
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(password, user.password);              // password is stored in DB as user.passowrd

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate JWT token
        const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        // Send response (never send password)
        return res.status(200).json({
            success: true,
            message: "Signin successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch(error) {
        console.error("Signin Error", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};