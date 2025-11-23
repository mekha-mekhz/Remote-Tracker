import React, { useEffect, useState } from "react";
import api from "../components/api";
import { motion } from "framer-motion";
import { Bell, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications"); 
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}`, { read: true });
      fetchNotifications();
    } catch (err) {
      console.error("Error updating notification:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    if (type === "task") return <Bell className="text-blue-600" size={22} />;
    if (type === "deadline") return <Clock className="text-orange-600" size={22} />;
    if (type === "warning") return <AlertTriangle className="text-red-600" size={22} />;
    return <Bell size={22} />;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">Notifications</h1>

        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-600 text-center mt-12">No notifications available.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl shadow flex items-start gap-4 ${
                  n.read ? "bg-white" : "bg-blue-50"
                }`}
              >
                <div>{getIcon(n.type)}</div>

                <div className="flex-1">
                  <h3 className="font-semibold">{n.title}</h3>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                {!n.read && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Mark as Read
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
