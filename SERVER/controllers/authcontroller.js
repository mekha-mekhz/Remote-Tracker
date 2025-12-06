require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");




// ====================== CREATE USER / REGISTER ======================

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, position } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle image upload
    let profilePhoto = "";
    if (req.file?.path) {
      profilePhoto = req.file.path;
    }

    // ⭐ Create new user first
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      profilePhoto,
      position,

      premium: false,
      premiumExpiresAt: null,

      isVerified: false, // default
    });

    // ⭐ If admin → auto verify
    if (role === "admin") {
      newUser.isVerified = true;
    }

    // Save user
    await newUser.save();

    res.status(201).json({
      message:
        role === "admin"
          ? "Admin registered successfully"
          : "Registration successful. Wait for Admin Approval.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        position: newUser.position,
        profilePhoto: newUser.profilePhoto,
        premium: newUser.premium,
        premiumExpiresAt: newUser.premiumExpiresAt,
        isVerified: newUser.isVerified,
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

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Resolve secret key safely
    const SECRET = process.env.SECRET_KEY || process.env.secretkey;
    if (!SECRET) {
      console.error("❌ SECRET KEY MISSING");
      return res.status(500).json({
        message: "Server error: Secret key not configured",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        premium: user.premium,
      },
      SECRET,
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
        premium: user.premium,
        premiumExpiresAt: user.premiumExpiresAt,
      },
      token,
    });

  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== GET LOGGED-IN USER ======================
exports.getLoggedUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error in getLoggedUser:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== ADMIN DASHBOARD ======================
exports.adminDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email role premium"
    );

    res.status(200).json({
      message: "Welcome to the admin dashboard",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================== LOGOUT ======================
exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

// ====================== GET ALL USERS ======================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================== UPDATE USER ======================
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, position } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, position },
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error in updateUser:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== DELETE USER ======================
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error in deleteUser:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== UPGRADE TO PREMIUM ======================
exports.upgradeToPremium = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.premium = true;

    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);

    user.premiumExpiresAt = expiry;
    await user.save();

    res.status(200).json({
      message: "User upgraded to Premium successfully",
      user,
    });
  } catch (err) {
    console.error("Upgrade error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== VERIFY USER (ADMIN) ======================
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "User verified successfully",
      user,
    });
  } catch (err) {
    console.error("Error verifying user:", err);
    res.status(500).json({ message: err.message });
  }
};
