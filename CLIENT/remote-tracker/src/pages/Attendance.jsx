// src/pages/Attendance.jsx
import React, { useState, useEffect } from "react";
import api from "../components/api";
import { useAuth } from "../context/Authcontext";

function Attendance() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [todayAttendance, setTodayAttendance] = useState(null);
  const [allAttendance, setAllAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch attendance
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.get("/attendance/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const entries = res.data.entries || [];

      // Today's date string
      const todayStr = new Date().toISOString().split("T")[0];
      const today = entries.find(
        (e) => new Date(e.date).toISOString().split("T")[0] === todayStr
      );

      setTodayAttendance(today || null);
      setAllAttendance(entries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Check-in
  const checkIn = async () => {
    try {
      await api.post("/attendance/checkin", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
    }
  };

  // Check-out
  const checkOut = async () => {
    try {
      await api.post("/attendance/checkout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed");
    }
  };

  // Format time
  const formatTime = (date) => (date ? new Date(date).toLocaleTimeString() : "-");

  // Today's total hours
  const todayTotalHours = todayAttendance?.sessions?.reduce(
    (sum, s) => sum + (s.checkOut ? (new Date(s.checkOut) - new Date(s.checkIn)) / 3600000 : 0),
    0
  ) || 0;

  // Determine status
  const getTodayStatus = () => {
    if (!todayAttendance) return "Absent";
    return todayTotalHours >= 1 ? "Present" : "Absent";
  };

  // Determine buttons
  const lastSession = todayAttendance?.sessions?.slice(-1)[0];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Attendance</h1>

      {/* Today Attendance */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Today's Attendance</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p>Total Hours: {todayTotalHours.toFixed(2)}</p>
            <p>Status: <span className={getTodayStatus() === "Present" ? "text-green-600" : "text-red-600"}>{getTodayStatus()}</span></p>

            <div className="mt-4 flex gap-4">
              {/* Check-in button */}
              {(!lastSession || lastSession.checkOut) && (
                <button onClick={checkIn} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Check In
                </button>
              )}
              {/* Check-out button */}
              {lastSession && !lastSession.checkOut && (
                <button onClick={checkOut} className="bg-red-600 text-white px-4 py-2 rounded">
                  Check Out
                </button>
              )}
            </div>

            {/* Sessions list */}
            {todayAttendance?.sessions?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Today's Sessions:</h3>
                {todayAttendance.sessions.map((s, idx) => (
                  <div key={idx} className="flex justify-between border-b py-1">
                    <span>Check-in: {formatTime(s.checkIn)}</span>
                    <span>Check-out: {s.checkOut ? formatTime(s.checkOut) : "In Progress"}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* All Attendance */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">All Attendance</h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Check-in</th>
              <th className="border px-2 py-1">Check-out</th>
              <th className="border px-2 py-1">Total Hours</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {allAttendance.map((entry) => {
              const entryTotalHours = entry.sessions?.reduce(
                (sum, s) => sum + (s.checkOut ? (new Date(s.checkOut) - new Date(s.checkIn)) / 3600000 : 0),
                0
              ) || 0;

              return (
                <tr key={entry._id}>
                  <td className="border px-2 py-1">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="border px-2 py-1">
                    {entry.sessions?.map((s, i) => (
                      <div key={i}>{formatTime(s.checkIn)}</div>
                    ))}
                  </td>
                  <td className="border px-2 py-1">
                    {entry.sessions?.map((s, i) => (
                      <div key={i}>{s.checkOut ? formatTime(s.checkOut) : "In Progress"}</div>
                    ))}
                  </td>
                  <td className="border px-2 py-1">{entryTotalHours.toFixed(2)}</td>
                  <td className={`border px-2 py-1 ${entryTotalHours >= 1 ? "text-green-600" : "text-red-600"}`}>
                    {entryTotalHours >= 1 ? "Present" : "Absent"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;
