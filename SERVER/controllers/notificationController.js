import Notification from "../models/notificationmodel.js";

// GET notifications for logged user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const notifications = await Notification.find({
      $or: [{ userId }, { role: userRole }, { role: "all" }],
    }).sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// MARK ONE AS READ
export const markNotificationRead = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await Notification.findByIdAndUpdate(
      id,
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

// MARK ALL READ
export const markAllRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

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

// DELETE NOTIFICATION
export const deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Notification.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

// ADMIN: GET ALL NOTIFICATIONS
export const adminGetAllNotifications = async (req, res) => {
  try {
    const data = await Notification.find().sort({ createdAt: -1 });
    res.json({ notifications: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all notifications" });
  }
};

// Helper function: CREATE A NOTIFICATION
export const createNotification = async ({
  title,
  message,
  type = "info",
  userId = null,
  role = "user",
}) => {
  try {
    const notify = new Notification({
      title,
      message,
      type,
      userId,
      role,
    });

    await notify.save();
  } catch (err) {
    console.log("Notification creation failed:", err.message);
  }
};
