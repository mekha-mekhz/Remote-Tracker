import Notification from "../models/notificationmodel.js";

/* ================================
   GET NOTIFICATIONS FOR LOGGED USER
================================ */
export const getNotifications = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;

    const notifications = await Notification.find({
      $or: [{ userId }, { role: userRole }, { role: "all" }],
    }).sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

/* ================================
      MARK SINGLE AS READ
================================ */
export const markNotificationRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({
      message: "Notification marked as read",
      notification: updated,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update notification" });
  }
};

/* ================================
        MARK ALL AS READ
================================ */
export const markAllRead = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;

    await Notification.updateMany(
      {
        $or: [{ userId }, { role: userRole }, { role: "all" }],
      },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update notifications" });
  }
};

/* ================================
        DELETE NOTIFICATION
================================ */
export const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

/* ================================
      ADMIN – GET ALL NOTICES
================================ */
export const adminGetAllNotifications = async (req, res) => {
  try {
    const data = await Notification.find().sort({ createdAt: -1 });
    res.json({ notifications: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all notifications" });
  }
};

/* ================================
         HELPER: CREATE
================================ */
export const createNotification = async ({
  title,
  message,
  type = "info",
  userId = null,
  role = "user",
}) => {
  try {
    await Notification.create({
      title,
      message,
      type,
      userId,
      role,
    });
  } catch (err) {
    console.log("Notification creation failed:", err.message);
  }
};
