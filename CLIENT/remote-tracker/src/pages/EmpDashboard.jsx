import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function EmployeeDashboard() {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [dailyStatus, setDailyStatus] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [leaveData, setLeaveData] = useState(null);

  const [proofFile, setProofFile] = useState(null);
  const [logText, setLogText] = useState("");

  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchAll = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const profile = await axios.get("/api/user/me", { headers });
      const daily = await axios.get("/api/user/daily-status", { headers });
      const week = await axios.get("/api/logs/weekly", { headers });
      const assigned = await axios.get("/api/tasks/user", { headers });
      const notifs = await axios.get("/api/notifications/user", { headers });
      const leaves = await axios.get("/api/user/leaves", { headers });

      setUser(profile.data.user || {});
      setDailyStatus(daily.data || {});

      // ✔ Weekly stats (wrapped inside `week.data.stats`)
      setWeeklyStats(week.data.stats || []);

      // ✔ Tasks (wrapped inside `assigned.data.tasks`)
      setTasks(assigned.data.tasks || []);

      // ✔ Notifications (wrapped inside `notifs.data.notifications`)
      setNotifications(notifs.data.notifications || []);

      setLeaveData(leaves.data || {});
    } catch (err) {
      console.log("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAll();
}, []);


  // ⛔ While loading — prevent UI crash
  if (loading) {
    return (
      <div className="text-center mt-10 text-xl font-semibold">
        Loading dashboard...
      </div>
    );
  }

  return (
    <>
      {/* Profile Section */}
      <motion.div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.profilePhoto || "/default-avatar.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
            <p>User ID: {user?._id}</p>
            <p className="text-gray-600 text-sm">
              Last Login: {user?.lastLogin || "Not available"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Daily Status */}
      <motion.div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-3">📅 Daily Work Status</h3>

        <p>Status: <b>{dailyStatus?.status || "N/A"}</b></p>
        <p>Clock In: {dailyStatus?.clockIn || "-"}</p>
        <p>Clock Out: {dailyStatus?.clockOut || "-"}</p>
        <p>Total Hours: {dailyStatus?.totalHours || 0}</p>
        <p>Break Hours: {dailyStatus?.breakHours || 0}</p>
      </motion.div>

      {/* Weekly Productivity */}
      <motion.div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-3">📊 Weekly Productivity</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyStats || []}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hours" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Tasks */}
      <motion.div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">📌 Assigned Tasks</h3>

        {tasks?.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="p-4 bg-gray-100 rounded-md mb-2">
              <p className="font-bold">{task.title}</p>
              <p>{task.description}</p>
              <p>Deadline: {task.deadline}</p>

              <p
                className={`font-semibold ${
                  task.status === "completed"
                    ? "text-green-600"
                    : task.status === "in-progress"
                    ? "text-blue-600"
                    : "text-orange-600"
                }`}
              >
                {task.status}
              </p>
            </div>
          ))
        ) : (
          <p>No tasks assigned</p>
        )}
      </motion.div>

      {/* Upload Proof */}
      <motion.div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-3">📤 Upload Work Proof</h3>

        <input
          type="file"
          onChange={(e) => setProofFile(e.target.files?.[0])}
          className="mb-3"
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={() => {
            if (!proofFile) return;

            const form = new FormData();
            form.append("proof", proofFile);

            axios.post("/api/user/upload-proof", form, {
              headers: { Authorization: `Bearer ${token}` },
            });

            setProofFile(null);
          }}
        >
          Upload
        </button>
      </motion.div>

      {/* Work Log */}
      <motion.div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-3">📝 Submit Work Log</h3>

        <textarea
          value={logText}
          onChange={(e) => setLogText(e.target.value)}
          className="w-full p-3 border rounded-md"
          placeholder="Describe your work today..."
        ></textarea>

        <button
          className="bg-green-600 text-white px-4 py-2 mt-2 rounded-md"
          onClick={() => {
            axios.post(
              "/api/user/work-log",
              { text: logText },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setLogText("");
          }}
        >
          Submit Log
        </button>
      </motion.div>

      {/* Notifications */}
      <motion.div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-3">🔔 Notifications</h3>

        {notifications?.length > 0 ? (
          notifications.map((n) => (
            <div key={n._id} className="p-3 bg-gray-100 rounded-md mb-2">
              <p>{n.message}</p>
              <p className="text-sm text-gray-500">{n.date}</p>
            </div>
          ))
        ) : (
          <p>No notifications</p>
        )}
      </motion.div>

      {/* Leave Management */}
      <motion.div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-3">🏖 Leave Management</h3>

        <p>Total Leaves: {leaveData?.total || 0}</p>
        <p>Used Leaves: {leaveData?.used || 0}</p>
        <p>Remaining: {leaveData?.remaining || 0}</p>

        <button className="bg-purple-600 text-white px-4 py-2 rounded-md mt-3">
          Apply for Leave
        </button>
      </motion.div>

      {/* Settings */}
      <motion.div className="bg-white p-6 rounded-xl shadow-md mb-10">
        <h3 className="text-xl font-semibold mb-3">⚙ Settings</h3>

        <button className="bg-gray-700 text-white px-4 py-2 rounded-md mr-2">
          Update Profile
        </button>

        <button className="bg-red-600 text-white px-4 py-2 rounded-md">
          Change Password
        </button>
      </motion.div>
    </>
  );
}

export default EmployeeDashboard;
