import React, { useState, useEffect } from "react";
import api from "../components/api"; // axios instance

 function DailyLog() {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    timeSpent: "",
    blockers: "",
  });

  const fetchLogs = async () => {
    try {
      const res = await api.get("/dailylogs");
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/dailylogs", form);

      // Reset
      setForm({ title: "", description: "", timeSpent: "", blockers: "" });

      // Refresh list
      fetchLogs();
    } catch (err) {
      console.error("Failed to create log:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold mb-4">Daily Activity Log</h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded-xl shadow mb-8"
        >
          <h2 className="text-lg font-semibold mb-3">Add Work Log</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Task Title"
              className="p-3 border rounded"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <input
              type="number"
              placeholder="Time Spent (minutes)"
              className="p-3 border rounded"
              value={form.timeSpent}
              onChange={(e) => setForm({ ...form, timeSpent: e.target.value })}
            />
          </div>

          <textarea
            placeholder="Describe what you worked on..."
            className="mt-4 w-full p-3 border rounded"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <textarea
            placeholder="Any blockers or issues?"
            className="mt-4 w-full p-3 border rounded"
            rows={2}
            value={form.blockers}
            onChange={(e) => setForm({ ...form, blockers: e.target.value })}
          />

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Log
          </button>
        </form>

        {/* LOG LIST */}
        <h2 className="text-xl font-semibold mb-3">My Logs</h2>

        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{log.title}</h3>
              <p className="text-gray-600">{log.description}</p>

              {log.timeSpent && (
                <p className="text-sm mt-2">⏱ Time Spent: {log.timeSpent} mins</p>
              )}

              {log.blockers && (
                <p className="text-sm text-red-500">⚠ Blockers: {log.blockers}</p>
              )}

              <p className="text-xs text-gray-400 mt-2">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default DailyLog