require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

// ====================== CREATE USER / REGISTER ======================
exports.createUser = async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password, role, position } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Handle Cloudinary upload (multer-cloudinary)
    let profilePhoto = "";
    if (req.file && req.file.path) {
      profilePhoto = req.file.path; // Cloudinary auto-returns image URL
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      profilePhoto,
      position,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        position: newUser.position,
        profilePhoto: newUser.profilePhoto,
      },
    });
  } catch (err) {
    console.error("Error in createUser:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== LOGIN USER ======================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_KEY || process.env.secretkey,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position,
        profilePhoto: user.profilePhoto,
      },
      token,
    });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== ADMIN DASHBOARD (Protected Route Example) ======================
exports.adminDashboard = (req, res) => {
  res.status(200).json({
    message: `Welcome to the admin dashboard, ${req.user?.name || "Admin"}`,
  });
};

// ====================== LOGOUT ======================
exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
