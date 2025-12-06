// src/pages/ManagerRecords.jsx
import React, { useState } from "react";

function ManagerRecords() {
  // Temporary local records
  const [records, setRecords] = useState([
    { id: 1, action: "Added", title: "Task A", time: "2025-12-03 10:30" },
    { id: 2, action: "Deleted", title: "Task B", time: "2025-12-02 15:00" },
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Action Records</h1>
      {records.length === 0 ? (
        <p>No records available.</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="border p-2">Action</th>
              <th className="border p-2">Task Title</th>
              <th className="border p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td className="border p-2">{r.action}</td>
                <td className="border p-2">{r.title}</td>
                <td className="border p-2">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManagerRecords;
