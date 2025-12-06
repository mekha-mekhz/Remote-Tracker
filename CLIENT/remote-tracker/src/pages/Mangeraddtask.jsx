// src/pages/ManagerAddTask.jsx
import React, { useState } from "react";
import api from "../components/api";

function ManagerAddTask() {
  const token = localStorage.getItem("token");

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
  });

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Task added successfully");
      setNewTask({ title: "", description: "", priority: "medium", assignedTo: "" });
    } catch {
      alert("Failed to add task");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Add Task</h1>
      <form className="bg-white p-6 rounded shadow max-w-md" onSubmit={handleAddTask}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newTask.description}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          name="assignedTo"
          placeholder="Assign To (Employee ID)"
          value={newTask.assignedTo}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        <select
          name="priority"
          value={newTask.priority}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        >
          <option>low</option>
          <option>medium</option>
          <option>high</option>
        </select>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Add Task</button>
      </form>
    </div>
  );
}

export default ManagerAddTask;
