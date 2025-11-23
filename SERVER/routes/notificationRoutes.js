import express from "express";
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
  markAllRead,
  adminGetAllNotifications,
} from "../controllers/notificationController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// User routes
router.get("/", auth.authuser, getNotifications);
router.put("/:id/read", auth.authuser, markNotificationRead);
router.put("/read/all", auth.authuser, markAllRead);
router.delete("/:id", auth.authuser, deleteNotification);

// Admin route
router.get(
  "/admin/all",
  auth.authuser,
  auth.authorizeRoles("admin"),
  adminGetAllNotifications
);

export default router;
