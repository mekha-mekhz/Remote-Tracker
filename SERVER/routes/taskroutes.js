const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskcontroller");
const auth = require("../middleware/auth");

// Protected routes
router.post("/", auth.authuser, taskController.createTask);
router.get("/", auth.authuser, taskController.getAllTasks);
router.get("/:id", auth.authuser, taskController.getTaskById);
router.put("/:id", auth.authuser, taskController.updateTask);
router.delete("/:id", auth.authuser, taskController.deleteTask);
router.patch("/:id/status", auth.authuser, taskController.updateStatus);

module.exports = router;
