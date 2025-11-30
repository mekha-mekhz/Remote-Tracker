import React, { useEffect, useState } from "react";
import api from "../components/api";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [leaves, setLeaves] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const allLeaves = await api.get("/leave/all", { headers });
        const allUsers = await api.get("/user/all", { headers });
        const allTasks = await api.get("/tasks/all", { headers });

        setLeaves(allLeaves.data.leaves || []);
        setUsers(allUsers.data.users || []);
        setTasks(allTasks.data.tasks || []);
      } catch (err) {
        console.log("Admin Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const updateLeaveStatus = async (id, status) => {
    try {
      await api.patch(`/leave/${id}/status`, { status }, { headers });

      setLeaves((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status } : l))
      );
    } catch (err) {
      console.log("Status update error:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-xl font-semibold mt-10">
        Loading admin panel...
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* USERS */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">👥 All Users</h2>

        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="p-4 bg-gray-100 mb-3 rounded-md flex items-center gap-4"
            >
              <img
                src={user.profilePhoto || "/default-avatar.png"}
                className="w-14 h-14 rounded-full border object-cover"
              />
              <div>
                <p><b>{user.name}</b></p>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <p>Position: {user.position}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>

      {/* LEAVES */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">🏖 Leave Requests</h2>

        {leaves.length > 0 ? (
          leaves.map((leave) => (
            <div
              key={leave._id}
              className="p-4 bg-gray-100 rounded-md mb-4"
            >
              <p><b>User:</b> {leave.user?.name}</p>
              <p><b>Type:</b> {leave.leaveType}</p>
              <p><b>From:</b> {new Date(leave.startDate).toLocaleDateString()}</p>
              <p><b>To:</b> {new Date(leave.endDate).toLocaleDateString()}</p>
              <p><b>Status:</b> {leave.status}</p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => updateLeaveStatus(leave._id, "approved")}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateLeaveStatus(leave._id, "rejected")}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No leave requests.</p>
        )}
      </div>

      {/* TASKS */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">📌 Tasks Assigned</h2>

        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task._id}
              className="p-4 bg-gray-100 rounded-md mb-3"
            >
              <p><b>{task.title}</b></p>
              <p>{task.description}</p>
              <p>Deadline: {task.deadline}</p>
              <p>Status: {task.status}</p>
              <p>User: {task.assignedTo?.name}</p>
            </div>
          ))
        ) : (
          <p>No tasks added.</p>
        )}
      </div>

    </div>
  );
}

export default AdminDashboard;
