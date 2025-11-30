const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/roleMiddleware");
const User = require("../models/usermodel");
const Leave = require("../models/leavemodel");
const Task = require("../models/taskmodel");

// 📌 Get all users
router.get("/users", auth.authuser, role.onlyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Get all leave requests
router.get("/leaves", auth.authuser, role.onlyAdmin, async (req, res) => {
  try {
    const leaves = await Leave.find().populate("user", "name email role");
    res.status(200).json({ leaves });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Approve / Reject Leave
router.patch("/leave/:id/status", auth.authuser, role.onlyAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({ message: "Leave updated", leave: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Get all tasks
router.get("/tasks", auth.authuser, role.onlyAdmin, async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
