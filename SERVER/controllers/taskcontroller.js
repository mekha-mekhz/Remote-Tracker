const Task = require("../models/taskmodel");
const User = require("../models/usermodel");

// ====================== CREATE TASK ======================
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, estimatedMinutes } = req.body;

    // Ensure only managers/admins can create tasks
    if (req.user.role === "user") {
      return res.status(403).json({ message: "Only managers or admins can create tasks" });
    }

    const newTask = new Task({
      title,
      description,
      assignedTo,
      priority,
      estimatedMinutes,
      createdBy: req.user.id, // from middleware
    });

    await newTask.save();
    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (err) {
    console.error("Error in createTask:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== GET ALL TASKS ======================
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email position")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ tasks });
  } catch (err) {
    console.error("Error in getAllTasks:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== GET TASK BY ID ======================
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id)
      .populate("assignedTo", "name email position")
      .populate("createdBy", "name email role");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (err) {
    console.error("Error in getTaskById:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== UPDATE TASK ======================
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (err) {
    console.error("Error in updateTask:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== DELETE TASK ======================
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error in deleteTask:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== UPDATE TASK STATUS ======================
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["todo", "in_progress", "done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task status updated", task });
  } catch (err) {
    console.error("Error in updateStatus:", err);
    res.status(500).json({ message: err.message });
  }
};
