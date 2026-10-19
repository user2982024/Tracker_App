const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to continue.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
    };

    // Move to next middlewaare/controller
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Your session has expired. Please sign in again.",
    });
  }
};

module.exports = authMiddleware;
