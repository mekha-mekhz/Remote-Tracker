import React, { useState, useEffect } from "react";
import api from "../components/api";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";

function PremiumDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [productivity, setProductivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trackerLoading, setTrackerLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const fetchData = async (tab) => {
    try {
      setLoading(true);
      if (tab === "profile") {
        const profileRes = await api.get("/me", { headers: { Authorization: `Bearer ${token}` } });
        setProfile(profileRes.data.user || {});
      }
      if (tab === "attendance") {
        await fetchAttendance();
      }
      if (tab === "leaves") {
        const leaveRes = await api.get("/leave/my", { headers: { Authorization: `Bearer ${token}` } });
        setLeaves(leaveRes.data.leaves || []);
      }
      if (tab === "productivity") {
        const prodRes = await api.get("/productivity/report", { headers: { Authorization: `Bearer ${token}` } });
        setProductivity(prodRes.data.reports || []);
      }
    } catch (err) {
      console.error("Error fetching premium data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      setTrackerLoading(true);
      const res = await api.get("/attendance/my", { headers: { Authorization: `Bearer ${token}` } });
      const todayStr = new Date().toISOString().split("T")[0];
      const today = res.data.entries.find(e => new Date(e.date).toISOString().split("T")[0] === todayStr);
      setTodayAttendance(today || null);
      setAttendance(res.data.entries || []);
      
      // If today has an active session, start timer
      const lastSession = today?.sessions?.[today.sessions.length - 1];
      if (lastSession && !lastSession.checkOut) {
        const start = new Date(lastSession.checkIn).getTime();
        setTimer(Math.floor((Date.now() - start) / 1000));
      } else {
        setTimer(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTrackerLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const checkIn = async () => {
    try {
      await api.post("/attendance/checkin", {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
    }
  };

  const checkOut = async () => {
    try {
      await api.post("/attendance/checkout", {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchAttendance();
      setTimer(0);
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed");
    }
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "-");
  const formatTime = (date) => (date ? new Date(date).toLocaleTimeString() : "-");

  const lastSession = todayAttendance?.sessions?.[todayAttendance.sessions.length - 1];
  const canCheckIn = !lastSession || lastSession.checkOut;
  const canCheckOut = lastSession && !lastSession.checkOut;

  const formatTimer = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Premium Dashboard</h1>

      {/* ===== Tabs ===== */}
      <div className="flex flex-wrap gap-4 mb-8">
        {["profile", "leaves", "attendance", "productivity"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ===== Content ===== */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {activeTab === "profile" && (
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center md:items-start gap-6">
              <img
                src={profile?.profilePhoto && profile.profilePhoto.startsWith("http") ? profile.profilePhoto : "/default-avatar.png"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-2 border-blue-500 shadow"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-4">Profile</h2>
                <p><strong>Name:</strong> {profile.name || "-"}</p>
                <p><strong>Email:</strong> {profile.email || "-"}</p>
                <p><strong>Position:</strong> {profile.position || "-"}</p>

                {user?.premium && (
                  <button
                    onClick={() => navigate("/disputes/create")}
                    className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    🚨 Report Dispute
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
              <h2 className="text-xl font-semibold mb-4">Attendance</h2>
              {trackerLoading ? <p>Loading...</p> : (
                <>
                  {/* Time Tracker */}
                  {todayAttendance && (
                    <div className="mb-4 p-4 border rounded bg-yellow-50">
                      <p className="font-semibold mb-2">Today's Session</p>
                      {todayAttendance.sessions?.map((s, i) => (
                        <p key={i}>
                          {formatTime(s.checkIn)} - {s.checkOut ? formatTime(s.checkOut) : formatTime(Date.now())}
                        </p>
                      ))}
                      <p className="mt-2 font-semibold">Active Timer: {timer > 0 ? formatTimer(timer) : "00:00:00"}</p>
                    </div>
                  )}

                  <div className="flex gap-4 mb-4">
                    {canCheckIn && <button onClick={checkIn} className="bg-blue-600 text-white px-4 py-2 rounded">Check In</button>}
                    {canCheckOut && <button onClick={checkOut} className="bg-red-600 text-white px-4 py-2 rounded">Check Out</button>}
                  </div>

                  {/* Attendance Log */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Attendance Log</h3>
                    {attendance.length === 0 && !todayAttendance ? (
                      <p>No attendance records yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left">Date</th>
                              <th className="px-4 py-2 text-left">Check-in</th>
                              <th className="px-4 py-2 text-left">Check-out</th>
                              <th className="px-4 py-2 text-left">Total Hours</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {/* Today's session on top */}
                            {todayAttendance && (
                              <tr className="bg-yellow-50 font-semibold">
                                <td className="px-4 py-2">{formatDate(todayAttendance.date)}</td>
                                <td className="px-4 py-2">{todayAttendance.sessions[0] ? formatTime(todayAttendance.sessions[0].checkIn) : "-"}</td>
                                <td className="px-4 py-2">{todayAttendance.sessions[0]?.checkOut ? formatTime(todayAttendance.sessions[0].checkOut) : "In Progress"}</td>
                                <td className="px-4 py-2">{todayAttendance.totalHours || 0}</td>
                              </tr>
                            )}

                            {/* Past attendance */}
                            {attendance.filter(entry => entry.date !== todayAttendance?.date).map(entry => (
                              <tr key={entry._id}>
                                <td className="px-4 py-2">{formatDate(entry.date)}</td>
                                <td className="px-4 py-2">{formatTime(entry.checkIn)}</td>
                                <td className="px-4 py-2">{entry.checkOut ? formatTime(entry.checkOut) : "In Progress"}</td>
                                <td className="px-4 py-2">{entry.totalHours || 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "leaves" && (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Leave History</h2>
              {leaves.length === 0 ? (
                <p>No leave records.</p>
              ) : (
                <table className="min-w-full border divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Start Date</th>
                      <th className="px-4 py-2 text-left">End Date</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaves.map((leave) => (
                      <tr key={leave._id}>
                        <td className="px-4 py-2">{leave.leaveType || "-"}</td>
                        <td className="px-4 py-2">{formatDate(leave.startDate)}</td>
                        <td className="px-4 py-2">{formatDate(leave.endDate)}</td>
                        <td className="px-4 py-2">{leave.status || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "productivity" && (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Productivity Report</h2>
              {productivity.length === 0 ? (
                <p>No productivity data.</p>
              ) : (
                <div className="space-y-4">
                  {productivity.map((prod) => (
                    <div key={prod.date} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
                      <p><strong>Date:</strong> {prod.date}</p>
                      <p><strong>Total Minutes:</strong> {prod.totalMinutes || 0}</p>
                      <p><strong>Idle Minutes:</strong> {prod.totalIdle || 0}</p>
                      <p><strong>Tasks Worked On:</strong></p>
                      <ul className="ml-6 list-disc">
                        {prod.tasksWorkedOn && Object.entries(prod.tasksWorkedOn).length > 0 ? (
                          Object.entries(prod.tasksWorkedOn).map(([task, minutes]) => (
                            <li key={task}>{task}: {minutes} min</li>
                          ))
                        ) : (
                          <li>No tasks logged</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PremiumDashboard;
