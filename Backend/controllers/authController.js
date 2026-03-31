const authService = require("../services/auth.service");

// Signup Controller
exports.signup = async (req, res) => {
  try {
    // Get validated data
    const { name, email, password } = req.body;

    // Call service
    const user = await authService.signup({
      name,
      email,
      password,
    });

    // Send response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error("Signup Controller Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Signin Controller
exports.signin = async (req, res) => {
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
      secure: true, // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    console.error("Signin Controller Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Signout controller
exports.signout = async (req, res) => {
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
    console.error("Logout Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
