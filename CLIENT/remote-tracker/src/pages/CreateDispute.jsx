import React, { useState } from "react";
import api from "../components/api";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";

function CreateDispute() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({ title: "", description: "", priority: "medium" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/disputes/create", form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Dispute reported successfully");
      navigate("/premium-users");
    } catch (err) {
      console.error(err);
      alert("Failed to report dispute");
    }
  };

  return (
    <form className="p-6 bg-white rounded shadow max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Report a Dispute</h2>

      <input
        name="title"
        placeholder="Dispute Title"
        value={form.title}
        onChange={handleChange}
        required
        className="w-full p-2 mb-3 border rounded"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
        className="w-full p-2 mb-3 border rounded"
      />

      <select
        name="priority"
        value={form.priority}
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
        Submit Dispute
      </button>
    </form>
  );
}

export default CreateDispute;
