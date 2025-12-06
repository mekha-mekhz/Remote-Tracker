const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/authcontroller");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// Register
router.post("/register", upload.single("profilePhoto"), authcontroller.createUser);

// Login
router.post("/login", authcontroller.loginUser);

// Get all users (admin only)
router.get(
  "/users",
  auth.authuser,
  auth.authorizeRoles("admin"),
  authcontroller.getAllUsers
);

// Get logged-in user
router.get("/me", auth.authuser, authcontroller.getLoggedUser);

// Admin dashboard
router.get(
  "/admin/dashboard",
  auth.authuser,
  auth.authorizeRoles("admin"),
  authcontroller.adminDashboard
);

// Logout
router.get("/logout", authcontroller.logoutUser);
// Update user (admin only)
router.put(
  "/user/:id",
  auth.authuser,
  auth.authorizeRoles("admin"),
  authcontroller.updateUser
);

// Delete user (admin only)
router.delete(
  "/user/:id",
  auth.authuser,
  auth.authorizeRoles("admin"),
  authcontroller.deleteUser
);
router.post("/upgrade", auth.authuser, authcontroller.upgradeToPremium);
router.put("/verify/:id", auth.authuser, auth.authorizeRoles("admin"), authcontroller.verifyUser);


module.exports = router;
