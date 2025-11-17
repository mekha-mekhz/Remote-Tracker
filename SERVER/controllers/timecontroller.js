const TimeEntry = require("../models/timeEntryModel");
const Task = require("../models/taskmodel");

// ✅ START TIMER
exports.startTimer = async (req, res) => {
  try {
    const { taskId, notes } = req.body;

    const newEntry = new TimeEntry({
      user: req.user.id,
      task: taskId || null,
      start: new Date(),
      notes,
      lastPing: new Date(),
      status: "active",
    });

    await newEntry.save();

    res.status(201).json({
      message: "Timer started successfully",
      timeEntry: newEntry,
    });
  } catch (err) {
    console.error("Error starting timer:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ STOP TIMER
exports.stopTimer = async (req, res) => {
  try {
    const { entryId } = req.params;
    const entry = await TimeEntry.findById(entryId);

    if (!entry) return res.status(404).json({ message: "Time entry not found" });
    if (entry.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to stop this timer" });
    if (entry.end) return res.status(400).json({ message: "Timer already stopped" });

    entry.end = new Date();
    entry.durationMinutes = Math.round((entry.end - entry.start) / (1000 * 60));
    entry.status = "stopped";
    await entry.save();

    res.status(200).json({
      message: "Timer stopped successfully",
      timeEntry: entry,
    });
  } catch (err) {
    console.error("Error stopping timer:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ AUTO PING — keeps user active
exports.pingTimer = async (req, res) => {
  try {
    const { entryId } = req.params;
    const entry = await TimeEntry.findById(entryId);

    if (!entry) return res.status(404).json({ message: "Time entry not found" });
    if (entry.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to ping this timer" });
    if (entry.status === "stopped")
      return res.status(400).json({ message: "Cannot ping a stopped timer" });

    entry.lastPing = new Date();
    entry.status = "active";
    await entry.save();

    res.status(200).json({
      message: "Ping received — user marked active",
      timeEntry: entry,
    });
  } catch (err) {
    console.error("Error pinging timer:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ AUTO CHECK FOR IDLE USERS (can be used with CRON every 10 mins)
exports.markIdleEntries = async () => {
  try {
    const now = new Date();
    const idleThreshold = 10 * 60 * 1000; // 10 minutes

    const activeEntries = await TimeEntry.find({ status: "active" });
    for (const entry of activeEntries) {
      if (now - new Date(entry.lastPing) > idleThreshold) {
        entry.status = "idle";
        await entry.save();
        console.log(`Entry ${entry._id} marked as IDLE`);
      }
    }
  } catch (err) {
    console.error("Error auto-marking idle entries:", err);
  }
};

// ✅ GET USER’S OWN ENTRIES
exports.getMyEntries = async (req, res) => {
  try {
    const entries = await TimeEntry.find({ user: req.user.id })
      .populate("task", "title status")
      .sort({ createdAt: -1 });

    res.status(200).json({ entries });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ADMIN: GET ALL ENTRIES
exports.getAllEntries = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    const entries = await TimeEntry.find()
      .populate("user", "name email position")
      .populate("task", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({ entries });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
