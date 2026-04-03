const authService = require("../services/auth.service");

// Signup Controller
exports.signup = async (req, res, next) => {
  try {
    // Get validated data
    const { name, email, password } = req.body;

    // Call service
    const result = await authService.signup({
      name,
      email,
      password,
    });

    // Set cookie (same as signin)
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days  
    });

    // Send response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.user,
    });
  } catch (error) {
    next(error);
  }
};

// Signin Controller
exports.signin = async (req, res, next) => {
  try {
    // Get validated data
    const { email, password } = req.body;

    // Call service
    const result = await authService.signin({ email, password });

    // Set cookie
    res.cookie("token", result.token, {
      httpOnly: true, // cannot be accessed by JS (XSS protection)
      secure: process.env.NODE_ENV === "production", // only HTTPs in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result.user,
    });
  } catch (error) {
    next(error);
  }
};

// Signout controller
exports.signout = async (req, res, next) => {
  try {
    // Clear cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Send response
    return res.status(200).json({
      success: true,
      message: "User signed out successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// Get authenticated user controller
exports.getCurrentUser = async (req, res, next) => {
  try {
    // userId comes from authMiddleware
    const userId = req.user.userId;

    const user = await authService.getCurrentUser(userId);

    return res.status(200).json({
      success: true,
      user,
    });
  }
  catch (error) {
    next(error);
  }
};