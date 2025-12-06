import React, { useState, useEffect } from "react";
import api from "../components/api";

function TimeTracker() {
  const token = localStorage.getItem("token");
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchToday = async () => {
    setLoading(true);
    try {
      const res = await api.get("/attendance/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const todayStr = new Date().toISOString().split("T")[0];
      const today = res.data.entries.find(e => e.date === todayStr);
      setTodayAttendance(today || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  const checkIn = async () => {
    try {
      await api.post("/attendance/checkin", {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchToday();
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
    }
  };

  const checkOut = async () => {
    try {
      await api.post("/attendance/checkout", {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchToday();
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed");
    }
  };

  const lastSession = todayAttendance?.sessions?.[todayAttendance.sessions.length - 1];
  const canCheckIn = !lastSession || lastSession.checkOut;
  const canCheckOut = lastSession && !lastSession.checkOut;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Time Tracker</h1>
      {loading ? <p>Loading...</p> : (
        <>
          <div className="mb-4">
            <p>Total Hours Today: {todayAttendance?.totalHours || 0}</p>
            <p>Sessions:</p>
            {todayAttendance?.sessions?.map((s, i) => (
              <p key={i}>
                {new Date(s.checkIn).toLocaleTimeString()} - {s.checkOut ? new Date(s.checkOut).toLocaleTimeString() : "In Progress"}
              </p>
            ))}
          </div>

          <div className="flex gap-4">
            {canCheckIn && <button onClick={checkIn} className="bg-blue-600 text-white px-4 py-2 rounded">Check In</button>}
            {canCheckOut && <button onClick={checkOut} className="bg-red-600 text-white px-4 py-2 rounded">Check Out</button>}
          </div>
        </>
      )}
    </div>
  );
}

export default TimeTracker;
