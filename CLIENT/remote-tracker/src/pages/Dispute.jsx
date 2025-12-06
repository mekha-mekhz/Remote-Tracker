// src/pages/AdminDisputes.jsx
import React, { useEffect, useState } from "react";
import api from "../components/api";

function AdminDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/disputes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDisputes(res.data.disputes || []);
      } catch (err) {
        console.error("Error fetching disputes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDisputes();
  }, [token]);

  const handleResolve = async (id) => {
    try {
      await api.patch(
        `/admin/disputes/${id}/resolve`,
        { status: "resolved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDisputes((prev) =>
        prev.map((d) => (d._id === id ? { ...d, status: "resolved" } : d))
      );
    } catch {
      alert("Failed to resolve dispute");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dispute?")) return;
    try {
      await api.delete(`/admin/disputes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDisputes((prev) => prev.filter((d) => d._id !== id));
    } catch {
      alert("Failed to delete dispute");
    }
  };

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading disputes...</p>;

  if (disputes.length === 0)
    return <p className="p-6 text-center text-gray-500">No disputes found.</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Disputes / Issues</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {disputes.map((d) => (
          <div
            key={d._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold mb-1">{d.title}</h2>
              <p className="text-gray-600 mb-2">{d.description}</p>
              <p className="text-sm text-gray-500 mb-2">
                User: {d.userName || "Unknown"}
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  d.status === "resolved"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {d.status.toUpperCase()}
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              {d.status !== "resolved" && (
                <button
                  onClick={() => handleResolve(d._id)}
                  className="flex-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Resolve
                </button>
              )}
              <button
                onClick={() => handleDelete(d._id)}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDisputes;
