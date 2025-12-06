// src/pages/AdminReports.jsx
import React, { useEffect, useState } from "react";
import api from "../components/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

function AdminReports() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTasks: 0,
    completedTasks: 0,
    pendingDisputes: 0,
    resolvedDisputes: 0,
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);

        // Fetch users
        const usersRes = await api.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const totalUsers = usersRes.data.length;

        // Fetch tasks
        const tasksRes = await api.get("/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const activeTasks = tasksRes.data.tasks.filter(t => t.status !== "done").length;
        const completedTasks = tasksRes.data.tasks.filter(t => t.status === "done").length;

        // Fetch disputes
        const disputesRes = await api.get("/admin/disputes/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pendingDisputes = disputesRes.data.openDisputes;
        const resolvedDisputes = disputesRes.data.resolvedDisputes;

        setStats({
          totalUsers,
          activeTasks,
          completedTasks,
          pendingDisputes,
          resolvedDisputes,
        });
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  if (loading) return <p className="p-6">Loading reports...</p>;

  // Chart data
  const taskData = [
    { name: "Active Tasks", count: stats.activeTasks },
    { name: "Completed Tasks", count: stats.completedTasks },
  ];

  const disputeData = [
    { name: "Pending Disputes", value: stats.pendingDisputes },
    { name: "Resolved Disputes", value: stats.resolvedDisputes },
  ];

  const COLORS = ["#FF8042", "#00C49F"];

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Admin Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Active Tasks</p>
          <p className="text-2xl font-bold">{stats.activeTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Completed Tasks</p>
          <p className="text-2xl font-bold">{stats.completedTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Pending Disputes</p>
          <p className="text-2xl font-bold">{stats.pendingDisputes}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Resolved Disputes</p>
          <p className="text-2xl font-bold">{stats.resolvedDisputes}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Tasks Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Tasks Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Disputes Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Disputes Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={disputeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {disputeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Detailed Reports</h2>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Report Type</th>
              <th className="border p-2 text-left">Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Total Users</td>
              <td className="border p-2">{stats.totalUsers}</td>
            </tr>
            <tr>
              <td className="border p-2">Active Tasks</td>
              <td className="border p-2">{stats.activeTasks}</td>
            </tr>
            <tr>
              <td className="border p-2">Completed Tasks</td>
              <td className="border p-2">{stats.completedTasks}</td>
            </tr>
            <tr>
              <td className="border p-2">Pending Disputes</td>
              <td className="border p-2">{stats.pendingDisputes}</td>
            </tr>
            <tr>
              <td className="border p-2">Resolved Disputes</td>
              <td className="border p-2">{stats.resolvedDisputes}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminReports;
