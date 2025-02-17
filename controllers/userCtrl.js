const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ Register User
exports.registerUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ userName, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

// ✅ Login User
exports.loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Find user by username
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your_secret",
      { expiresIn: "1h" }
    );
    req.session.userId = user._id;

    return res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};
