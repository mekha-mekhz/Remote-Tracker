// src/pages/ManagerLeaves.jsx
import React, { useEffect, useState } from "react";
import api from "../components/api";

function ManagerLeaves() {
  const token = localStorage.getItem("token");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leave/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data.leaves || []);
    } catch {
      console.error("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      await api.patch(`/leave/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(prev => prev.map(lv => lv._id === id ? { ...lv, status } : lv));
    } catch {
      alert("Failed to update leave");
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Leave Requests</h1>
      {loading ? (
        <p>Loading leave requests...</p>
      ) : leaves.length === 0 ? (
        <p>No leave requests.</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="border p-2">Employee</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Dates</th>
              <th className="border p-2">Reason</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((lv) => (
              <tr key={lv._id}>
                <td className="border p-2">{lv.user?.name}</td>
                <td className="border p-2">{lv.type}</td>
                <td className="border p-2">{lv.fromDate} → {lv.toDate}</td>
                <td className="border p-2">{lv.reason}</td>
                <td className="border p-2">{lv.status}</td>
                <td className="border p-2 flex gap-2 justify-center">
                  <button onClick={() => updateLeaveStatus(lv._id, "approved")} className="px-3 py-1 bg-green-500 text-white rounded">Approve</button>
                  <button onClick={() => updateLeaveStatus(lv._id, "rejected")} className="px-3 py-1 bg-red-500 text-white rounded">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManagerLeaves;
