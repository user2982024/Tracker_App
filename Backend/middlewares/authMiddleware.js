const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check for token in authorization header
    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer') 
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // If no token
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "not authorized, token missing"
        });
    }

    try {
        // Verrify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (without passowrd)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "User not found"
        });
    }

    // Continue to next middleware/ controller
    next();
    }
    catch(error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, token invalid or expired"
        });
    }
}

module.exports = protect;