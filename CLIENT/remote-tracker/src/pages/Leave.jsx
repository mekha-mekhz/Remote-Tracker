import React, { useState, useEffect } from "react";
import api from "../components/api";

function Leave() {
  const token = localStorage.getItem("token");

  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [myLeaves, setMyLeaves] = useState([]);

  const applyLeave = () => {
    api.post(
      "/leave/apply",
      { leaveType, startDate, endDate, reason },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => loadLeaves());
  };

  const loadLeaves = () => {
    api
      .get("/leave/my", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setMyLeaves(res.data.leaves || []));
  };

  useEffect(() => { loadLeaves(); }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Apply Leave</h1>

      <input placeholder="Leave Type" className="p-2 mb-2 bg-teal-800"
        onChange={(e) => setLeaveType(e.target.value)} />

      <input type="date" className="p-2 mb-2 bg-teal-800"
        onChange={(e) => setStartDate(e.target.value)} />

      <input type="date" className="p-2 mb-2 bg-teal-800"
        onChange={(e) => setEndDate(e.target.value)} />

      <textarea placeholder="Reason" className="p-2 mb-2 bg-teal-800"
        onChange={(e) => setReason(e.target.value)} />

      <button className="bg-lime-500 p-2 rounded" onClick={applyLeave}>
        Apply Leave
      </button>

      <h2 className="mt-6 text-xl font-bold">My Leaves</h2>
      <ul>
        {myLeaves.map((x) => (
          <li key={x._id}>{x.leaveType} — {x.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default Leave;
