const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

        // Hash passwwrd
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