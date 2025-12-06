import React, { useState } from "react";
import api from "../components/api";

function ApplyLeave() {
  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Get today in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-reset endDate if it's before startDate
    if (name === "startDate" && form.endDate && value > form.endDate) {
      setForm({ ...form, startDate: value, endDate: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!form.leaveType || !form.startDate || !form.endDate || !form.reason) {
      setMsg("⚠️ All fields are required.");
      return;
    }

    // Date validation
    if (form.startDate < today) {
      setMsg("⚠️ Start date cannot be a past date.");
      return;
    }

    if (form.endDate < form.startDate) {
      setMsg("⚠️ End date must be after start date.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await api.post("/leave/apply", form);
      setMsg("✅ Leave applied successfully!");

      setForm({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Something went wrong"));
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Apply Leave</h2>

      {msg && (
        <div className="mb-3 p-2 text-center rounded bg-blue-100 text-blue-700">
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Leave Type */}
        <label className="block font-semibold mb-1">Leave Type</label>
        <select
          name="leaveType"
          value={form.leaveType}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-4"
          required
        >
          <option value="">Select Leave Type</option>
          <option value="sick">Sick Leave</option>
          <option value="casual">Casual Leave</option>
          <option value="annual">Annual Leave</option>
          <option value="emergency">Emergency Leave</option>
        </select>

        {/* Start Date */}
        <label className="block font-semibold mb-1">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          min={today}          // ❗ cannot choose past date
          className="border p-2 w-full rounded mb-4"
          required
        />

        {/* End Date */}
        <label className="block font-semibold mb-1">End Date</label>
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          min={form.startDate || today}   // ❗ cannot choose before start date
          className="border p-2 w-full rounded mb-4"
          required
        />

        {/* Reason */}
        <label className="block font-semibold mb-1">Reason</label>
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="Enter reason for leave"
          className="border p-2 w-full rounded mb-4 h-24"
          required
        />

        {/* Submit Button */}
        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded"
        >
          {loading ? "Applying..." : "Apply Leave"}
        </button>
      </form>
    </div>
  );
}

export default ApplyLeave;
