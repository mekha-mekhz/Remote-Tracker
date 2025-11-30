import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../components/api";

function ApplyLeave() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };

      await api.post("/leave/apply", form, { headers });

      alert("Leave applied successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert("Failed to apply leave.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Apply for Leave</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Leave Type */}
        <div>
          <label className="block mb-1 font-semibold">Leave Type</label>
          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Type</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Emergency Leave">Emergency Leave</option>
            <option value="Vacation Leave">Vacation Leave</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block mb-1 font-semibold">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block mb-1 font-semibold">End Date</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block mb-1 font-semibold">Reason</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Enter your reason..."
            rows="4"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded w-full"
        >
          Submit Leave Request
        </button>
      </form>
    </div>
  );
}

export default ApplyLeave;
