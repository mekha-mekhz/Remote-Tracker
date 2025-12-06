import React, { useState, useEffect } from "react";
import api from "../components/api"; // Axios instance
import { useAuth } from "../context/Authcontext";

export default function AddTask({ onTaskCreated }) {
  const { user, token } = useAuth(); // get token from auth context

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    estimatedMinutes: 0,
  });

  const [users, setUsers] = useState([]);

  // Fetch all users for assignment
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/tasks", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message);
      setForm({ title: "", description: "", assignedTo: "", priority: "medium", estimatedMinutes: 0 });

      if (onTaskCreated) onTaskCreated(res.data.task); // optional callback to refresh task list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Task Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full p-3 border rounded"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-3 border rounded"
        />
        <select
          value={form.assignedTo}
          onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
          className="w-full p-3 border rounded"
        >
          <option value="">Assign to</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.role})
            </option>
          ))}
        </select>
        <select
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
          className="w-full p-3 border rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="number"
          placeholder="Estimated Minutes"
          value={form.estimatedMinutes}
          onChange={(e) => setForm({ ...form, estimatedMinutes: Number(e.target.value) })}
          className="w-full p-3 border rounded"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}
