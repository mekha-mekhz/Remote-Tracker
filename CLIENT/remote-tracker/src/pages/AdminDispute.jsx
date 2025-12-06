import React, { useEffect, useState } from "react";
import api from "../components/api";
import { useAuth } from "../context/Authcontext";

function AdminDisputes() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // LOAD DISPUTES (ADMIN)
  // ======================
  const fetchDisputes = async () => {
    try {
      setLoading(true);

      const res = await api.get("/disputes", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDisputes(res.data.disputes || []);
    } catch (err) {
      console.error("Failed to fetch disputes", err);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // DELETE DISPUTE
  // ======================
  const deleteDispute = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dispute?")) return;

    try {
      await api.delete(`/disputes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Dispute deleted successfully");
      fetchDisputes();
    } catch (err) {
      console.error("Failed to delete dispute", err);
      alert("Error deleting dispute");
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading disputes...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Manage Disputes</h1>

      {/* Disputes Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Reported By</th>
              <th className="p-3 text-left">Assigned To</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {disputes.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No disputes found
                </td>
              </tr>
            )}

            {disputes.map((d) => (
              <tr key={d._id} className="border-b hover:bg-gray-100 transition">
                <td className="p-3 font-medium">{d.title}</td>

                <td className="p-3">
                  {d.reportedBy
                    ? `${d.reportedBy.name} (${d.reportedBy.email})`
                    : "Unknown"}
                </td>

                <td className="p-3">
                  {d.assignedTo
                    ? `${d.assignedTo.name} (${d.assignedTo.email})`
                    : "Not assigned"}
                </td>

                <td className="p-3 capitalize">{d.priority}</td>

                <td className="p-3 capitalize">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      d.status === "open"
                        ? "bg-red-500"
                        : d.status === "in_progress"
                        ? "bg-yellow-500"
                        : "bg-green-600"
                    }`}
                  >
                    {d.status.replace("_", " ")}
                  </span>
                </td>

                <td className="p-3 flex gap-2">
                  {/* Edit Button */}
                  <button
                    onClick={() =>
                      (window.location.href = `/admin/disputes/edit/${d._id}`)
                    }
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteDispute(d._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDisputes;
