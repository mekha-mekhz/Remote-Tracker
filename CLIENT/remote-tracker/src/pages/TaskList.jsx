import React, { useState, useEffect } from "react";
import api from "../components/api";
import { useAuth } from "../context/Authcontext";

export default function TaskList() {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      let url = user.role === "user" ? "/tasks/user" : "/tasks";
      const res = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(user.role === "user" ? res.data.tasks : res.data.tasks);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch tasks");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading tasks...</p>;

  if (!tasks.length) return <p className="text-center mt-10">No tasks found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Assigned To</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Priority</th>
            <th className="px-4 py-2">Created By</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t._id} className="border-b">
              <td className="px-4 py-2">{t.title}</td>
              <td className="px-4 py-2">{t.assignedTo?.name || "-"}</td>
              <td className="px-4 py-2 capitalize">{t.status}</td>
              <td className="px-4 py-2 capitalize">{t.priority}</td>
              <td className="px-4 py-2">{t.createdBy?.name || "-"}</td>
              <td className="px-4 py-2">
                {/* Optional: Add edit/delete/status buttons here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
