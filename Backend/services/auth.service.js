const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.signup = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Hash password
  const salt = 10;
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Return safe user data
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

exports.signin = async ({ email, password }) => {
    // Find user
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or passowrd");
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        throw new Error("Invalid email or passowrd");
    }

    // Generate JWT
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    // Return safe data
    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        token,
    };
};