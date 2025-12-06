// src/pages/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import api from "../components/api";

function AdminUsers() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState(null); // user currently editing
  const [records, setRecords] = useState([]); // 🔹 store edited/deleted users
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    position: "",
  });

  const headers = { Authorization: `Bearer ${token}` };

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users", { headers });
        setUsers(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Edit click: populate form
  const handleEditClick = (user) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      position: user.position || "",
    });
  };

  // Update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/user/${editUser._id}`, formData, { headers });

      // 🔹 Add previous user data to records
      setRecords((prev) => [
        ...prev,
        {
          action: "edited",
          previousData: editUser,
          timestamp: new Date(),
        },
      ]);

      // Update users table
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === editUser._id ? res.data.user : u))
      );

      alert("User updated successfully");
      setEditUser(null);
      setFormData({ name: "", email: "", role: "user", position: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find((u) => u._id === userId);
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/user/${userId}`, { headers });

      // 🔹 Add deleted user to records
      setRecords((prev) => [
        ...prev,
        { action: "deleted", previousData: userToDelete, timestamp: new Date() },
      ]);

      setUsers((prev) => prev.filter((u) => u._id !== userId));
      alert("User deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading users...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">👥 Admin - Manage Users</h1>

      {/* Users Table */}
      <table className="min-w-full bg-white border rounded mb-6">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Position</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-4 py-2 border">{user.name}</td>
              <td className="px-4 py-2 border">{user.email}</td>
              <td className="px-4 py-2 border">{user.role}</td>
              <td className="px-4 py-2 border">{user.position || "-"}</td>
              <td className="px-4 py-2 border flex gap-2">
                <button
                  className="bg-yellow-500 px-2 py-1 text-white rounded"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 px-2 py-1 text-white rounded"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Form */}
      {editUser && (
        <div className="bg-white p-6 rounded shadow-md max-w-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
          <form onSubmit={handleUpdateUser} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
              required
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <input
              type="text"
              name="position"
              placeholder="Position"
              value={formData.position}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setEditUser(null);
                  setFormData({ name: "", email: "", role: "user", position: "" });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Records Table */}
      {records.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">📜 Edited / Deleted Users</h2>
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Action</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Position</th>
                <th className="px-4 py-2 border">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 border">{r.action}</td>
                  <td className="px-4 py-2 border">{r.previousData.name}</td>
                  <td className="px-4 py-2 border">{r.previousData.email}</td>
                  <td className="px-4 py-2 border">{r.previousData.role}</td>
                  <td className="px-4 py-2 border">{r.previousData.position || "-"}</td>
                  <td className="px-4 py-2 border">
                    {r.timestamp.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
