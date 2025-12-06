import React, { useState } from "react";
import TaskBoard from "./TaskBoard";
import TaskList from "./TaskList";
import AddTask from "./AddTask";

export default function TaskManagerDashboard() {
  const [view, setView] = useState("board"); // board / list / add

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Task Manager Dashboard</h1>

      {/* ===== View Switch Buttons ===== */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setView("board")}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === "board"
              ? "bg-blue-600 text-white"
              : "bg-white border text-gray-700 hover:bg-gray-100"
          }`}
        >
          Kanban Board
        </button>
        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === "list"
              ? "bg-blue-600 text-white"
              : "bg-white border text-gray-700 hover:bg-gray-100"
          }`}
        >
          Task List (Admin/Manager)
        </button>
        <button
          onClick={() => setView("add")}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === "add"
              ? "bg-blue-600 text-white"
              : "bg-white border text-gray-700 hover:bg-gray-100"
          }`}
        >
          Add Task
        </button>
      </div>

      {/* ===== Render Views ===== */}
      <div className="mt-4">
        {view === "board" && <TaskBoard />}
        {view === "list" && <TaskList />}
        {view === "add" && <AddTask />}
      </div>
    </div>
  );
}
