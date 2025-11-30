import React, { useState, useEffect } from "react";
import api from "../components/api";
import { useAuth } from "../context/Authcontext";

function EmpDashboard() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  // --- STATES ---
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [timer, setTimer] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const [showSettings, setShowSettings] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [profileImg, setProfileImg] = useState(user?.profile || "/default.png");

  // --- LOADING CHECK ---
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-900 text-lime-300 text-xl">
        Loading dashboard...
      </div>
    );
  }

  // --- FETCH DASHBOARD DATA ---
  useEffect(() => {
    // Leaves
    api
      .get("/leave/my", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const data = Array.isArray(res.data.leaves) ? res.data.leaves : [];
        setLeaves(data);
      })
      .catch(console.error);

    // Attendance
    api
      .get("/attendance/my", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setAttendance(data);
      })
      .catch(console.error);

    // Notifications
    api
      .get("/notifications", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setNotifications(data);
      })
      .catch(console.error);

    // Timer
    api
      .get("/time/my", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const active = data.find((t) => t.status === "active");
        if (active) {
          setTimer(active);
          setIsRunning(true);
          const start = new Date(active.start);
          setElapsed(Math.floor((Date.now() - start) / 1000));
        }
      })
      .catch(console.error);
  }, [user]);

  // --- TIMER TICK ---
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // --- FORMAT TIME ---
  const formatTime = (sec) => new Date(sec * 1000).toISOString().substr(11, 8);

  // --- START TIMER ---
  const startTimer = () => {
    if (timer && isRunning) {
      alert("You already have an active timer!");
      return;
    }

    api
      .post("/time/start", {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const startedTimer = res.data.timeEntry || res.data;
        if (!startedTimer || !startedTimer._id) {
          console.error("Timer start failed:", startedTimer);
          alert("Could not start timer. Try again.");
          return;
        }
        setTimer(startedTimer);
        setIsRunning(true);
        setElapsed(0);
      })
      .catch((err) => {
        console.error("Failed to start timer:", err.response?.data || err);
        alert(err.response?.data?.message || "Could not start timer. Try again.");
      });
  };

  // --- STOP TIMER ---
  const stopTimer = () => {
    if (!timer || !timer._id) {
      alert("No active timer to stop.");
      setTimer(null);
      setIsRunning(false);
      setElapsed(0);
      return;
    }

    api
      .put(`/time/stop/${timer._id}`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setTimer(null);
        setIsRunning(false);
        setElapsed(0);
      })
      .catch((err) => {
        console.error("Failed to stop timer:", err.response?.data || err);
        alert(err.response?.data?.message || "Could not stop timer. Try again.");
        setTimer(null);
        setIsRunning(false);
        setElapsed(0);
      });
  };

  // --- PROFILE UPLOAD ---
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("profile", file);

    api
      .put("/user/update-profile", form, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setProfileImg(res.data.profile);
        alert("Profile updated!");
      })
      .catch(console.error);
  };

  // --- SAVE SETTINGS ---
  const saveSettings = () => {
    api
      .put("/user/update", { name, password }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => alert("Changes saved!"))
      .catch(console.error);
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-teal-900 text-lime-300 p-6">
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <img src={profileImg} alt="Profile" className="w-20 h-20 rounded-full border-2 border-lime-400" />
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
            <p className={isRunning ? "text-lime-400" : "text-lime-200"}>
              ● {isRunning ? "Online - Tracking Work" : "Offline"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-teal-800 px-4 py-2 rounded-xl hover:bg-teal-700"
        >
          Settings ⚙️
        </button>
      </div>

      {/* TIME TRACKER */}
      <div className="bg-teal-800 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-2">Time Tracker</h2>
        <p className="text-4xl font-mono mb-4">{formatTime(elapsed)}</p>
        {!isRunning ? (
          <button onClick={startTimer} className="bg-lime-600 px-5 py-2 rounded-xl hover:bg-lime-500">
            ▶ Start Work
          </button>
        ) : (
          <button onClick={stopTimer} className="bg-red-600 px-5 py-2 rounded-xl hover:bg-red-500">
            ⏹ Stop Work
          </button>
        )}
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Leaves */}
        <div className="bg-teal-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Leave</h2>
          {Array.isArray(leaves) && leaves.length > 0 ? (
            <ul className="list-disc list-inside">
              {leaves.map((l) => (
                <li key={l._id}>{l.leaveType} — {l.status}</li>
              ))}
            </ul>
          ) : (
            <p>No leave records.</p>
          )}
        </div>

        {/* Attendance */}
        <div className="bg-teal-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Attendance</h2>
          {Array.isArray(attendance) && attendance.length > 0 ? (
            <ul className="list-disc list-inside">
              {attendance.map((a) => (
                <li key={a._id}>
                  Check-in: {new Date(a.checkIn).toLocaleTimeString()} | Check-out: {a.checkOut ? new Date(a.checkOut).toLocaleTimeString() : "Not yet"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No attendance yet.</p>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-teal-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          {Array.isArray(notifications) && notifications.length > 0 ? (
            <ul className="list-disc list-inside">
              {notifications.map((n) => <li key={n._id}>{n.message}</li>)}
            </ul>
          ) : (
            <p>No notifications.</p>
          )}
        </div>
      </div>

      {/* SETTINGS */}
      {showSettings && (
        <div className="bg-teal-800 p-6 rounded-2xl shadow-lg mt-8">
          <h2 className="text-xl font-bold mb-4">Settings</h2>

          <label className="block mb-4">
            Name:
            <input
              className="w-full p-2 mt-2 bg-teal-900 rounded text-lime-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="block mb-4">
            New Password:
            <input
              type="password"
              className="w-full p-2 mt-2 bg-teal-900 rounded text-lime-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className="block mb-4">
            Profile Photo:
            <input type="file" className="mt-2" onChange={handleProfileUpload} />
          </label>

          <button className="bg-lime-600 px-5 py-2 rounded-xl hover:bg-lime-500" onClick={saveSettings}>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

export default EmpDashboard;
