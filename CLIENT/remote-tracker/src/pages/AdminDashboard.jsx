import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../components/api";

function AdminDashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingApprovals: 0,
        activeTasks: 0,
        totalDisputes: 0,
        openDisputes: 0,
        resolvedDisputes: 0,
    });

    const [adminProfile, setAdminProfile] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1️⃣ Fetch admin profile
                const profileRes = await api.get("/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAdminProfile(profileRes.data.user);

                // 2️⃣ Fetch all users
                const usersRes = await api.get("/admin/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const users = usersRes.data.users; // backend returns { users: [...] }
                const totalUsers = users.length;
                const pendingApprovals = users.filter(u => !u.approved).length;

                // 3️⃣ Fetch all tasks
                const tasksRes = await api.get("/admin/tasks", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const tasks = tasksRes.data.tasks;
                const activeTasks = tasks.filter(
                    t => t.status === "todo" || t.status === "in_progress"
                ).length;

                // 4️⃣ Fetch dispute stats
                const disputesRes = await api.get("/admin/disputes/stats", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { totalDisputes, openDisputes, resolvedDisputes } = disputesRes.data;

                // 5️⃣ Update state
                setStats({
                    totalUsers,
                    pendingApprovals,
                    activeTasks,
                    totalDisputes,
                    openDisputes,
                    resolvedDisputes,
                });
            } catch (err) {
                console.error("Error fetching admin dashboard data:", err);
            }
        };

        fetchStats();
    }, [token]);

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-700 mt-1">Overview & management</p>
                </div>
                {adminProfile && (
                    <div className="flex items-center gap-4">
                        <img
                            src={adminProfile.profilePhoto || "/default.jpg"}
                            alt="Admin"
                            className="w-14 h-14 rounded-full border-2 border-blue-500 object-cover"
                        />
                        <div>
                            <p className="font-semibold">{adminProfile.name}</p>
                            <p className="text-gray-500 text-sm">{adminProfile.role}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div
                    className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                    onClick={() => navigate("/admin/users")}
                >
                    <p className="text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>

                <div
                    className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                    onClick={() => navigate("/admin/users?pending=true")}
                >
                    <p className="text-gray-500">Pending Approvals</p>
                    <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                </div>

                <div
                    className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                    onClick={() => navigate("/admin/tasks")}
                >
                    <p className="text-gray-500">Active Tasks</p>
                    <p className="text-2xl font-bold">{stats.activeTasks}</p>
                </div>

                <div
                    className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                    onClick={() => navigate("/admin/disputes")}
                >
                    <p className="text-gray-500">Open Disputes</p>
                    <p className="text-2xl font-bold">{stats.openDisputes}</p>
                </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-6">
                <button
                    onClick={() => navigate("/admin/users")}
                    className="px-6 py-4 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
                >
                    👥 Manage Users
                </button>

                <button
                    onClick={() => navigate("/admin/tasks")}
                    className="px-6 py-4 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
                >
                    📌 Manage Tasks
                </button>

                <button
                    onClick={() => navigate("/admin/reports")}
                    className="px-6 py-4 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700 transition"
                >
                    📊 View Reports
                </button>

                <button
                    onClick={() => navigate("/admin/notifications")}
                    className="px-6 py-4 bg-yellow-500 text-white rounded-xl shadow hover:bg-yellow-600 transition"
                >
                    🔔 Send Notifications
                </button>

                <button
                    onClick={() => navigate("/admin/roles")}
                    className="px-6 py-4 bg-red-600 text-white rounded-xl shadow hover:bg-red-700 transition"
                >
                    ⚙️ Role & Permissions
                </button>
                <button
                    onClick={() => navigate("/admin/approval")}
                    className="px-6 py-4 bg-red-600 text-white rounded-xl shadow hover:bg-red-700 transition"
                >
                    Registration Approval
                </button>
            </div>
        </div>
    );
}

export default AdminDashboard;
