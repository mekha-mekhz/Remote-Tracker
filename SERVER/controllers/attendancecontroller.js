const Attendance = require("../models/attendancemodel");

// ✅ CHECK-IN
exports.checkInUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of day

    // Check if already checked in today
    let attendance = await Attendance.findOne({ user: userId, date: today });
    if (attendance) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    attendance = new Attendance({
      user: userId,
      checkIn: new Date(),
      date: today
    });

    await attendance.save();

    res.status(201).json({ message: "Checked in successfully", attendance });
  } catch (err) {
    console.error("Error in checkInUser:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ CHECK-OUT
exports.checkOutUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({ user: userId, date: today });
    if (!attendance) {
      return res.status(400).json({ message: "You haven't checked in today" });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    attendance.checkOut = new Date();
    attendance.totalHours = ((attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60)).toFixed(2);
    await attendance.save();

    res.status(200).json({ message: "Checked out successfully", attendance });
  } catch (err) {
    console.error("Error in checkOutUser:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET MY ATTENDANCE
exports.getMyAttendance = async (req, res) => {
  try {
    const entries = await Attendance.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json({ entries });
  } catch (err) {
    console.error("Error in getMyAttendance:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ ADMIN / MANAGER: GET ALL ATTENDANCE
exports.getAllAttendance = async (req, res) => {
  try {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const entries = await Attendance.find()
      .populate("user", "name email position")
      .sort({ date: -1 });

    res.status(200).json({ entries });
  } catch (err) {
    console.error("Error in getAllAttendance:", err);
    res.status(500).json({ message: err.message });
  }
};
