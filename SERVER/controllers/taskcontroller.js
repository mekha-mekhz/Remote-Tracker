const Task = require("../models/taskmodel");
const User = require("../models/usermodel");
const { createNotification } = require("./notificationController");

// ====================== CREATE TASK ======================
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, estimatedMinutes } = req.body;

    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only managers or admins can create tasks",
      });
    }

    const newTask = new Task({
      title,
      description,
      assignedTo,
      priority,
      estimatedMinutes,
      createdBy: req.user.id,
    });

    await newTask.save();

    // 🔔 Create notification for assigned user
    if (assignedTo) {
      await createNotification({
        title: "New Task Assigned",
        message: `You have been assigned a new task: ${title}`,
        type: "task",
        userId: assignedTo,
      });
    }

    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (err) {
    console.error("Error in createTask:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== GET ALL TASKS (Admin & Manager) ======================
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

// ====================== GET SINGLE TASK ======================
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email role");

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);

  } catch (err) {
    console.error("Error in getTaskById:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== UPDATE TASK (Admin / Manager) ======================
exports.updateTask = async (req, res) => {
  try {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only managers/admins can update tasks",
      });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    // 🔔 Notify assigned user
    if (task.assignedTo) {
      await createNotification({
        title: "Task Updated",
        message: `The task "${task.title}" has been updated.`,
        type: "task",
        userId: task.assignedTo,
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (err) {
    console.error("Error in updateTask:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== DELETE TASK ======================
exports.deleteTask = async (req, res) => {
  try {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only managers/admins can delete tasks",
      });
    }

    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // 🔔 Notify assigned user
    if (task.assignedTo) {
      await createNotification({
        title: "Task Removed",
        message: `Your task "${task.title}" has been deleted.`,
        type: "warning",
        userId: task.assignedTo,
      });
    }

    res.status(200).json({ message: "Task deleted successfully" });

  } catch (err) {
    console.error("Error in deleteTask:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== UPDATE TASK STATUS (User Allowed) ======================
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["todo", "in_progress", "done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your task" });
    }

    task.status = status;
    await task.save();

    // 🔔 Notify creator
    await createNotification({
      title: "Task Status Updated",
      message: `The task "${task.title}" is now "${status}".`,
      type: "task",
      userId: task.createdBy,
    });

    res.status(200).json({
      message: "Status updated",
      task,
    });

  } catch (err) {
    console.error("Error in updateStatus:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== GET LOGGED-IN USER TASKS ======================
exports.getTasksForUser = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ tasks });
  } catch (err) {
    console.error("Error in getTasksForUser:", err);
    res.status(500).json({ message: err.message });
  }
};
