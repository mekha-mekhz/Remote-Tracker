import React from "react";
import { motion } from "framer-motion";

/**
 * TaskCard - simple card for a task
 * props:
 *  - task: task object
 *  - openNotes: fn to open notes / details modal (optional)
 */
 function TaskCard({ task, openNotes }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition cursor-grab"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-gray-800">{task.title}</h4>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description || "No description"}</p>
        </div>

        <div className="text-right">
          <div
            className={`text-xs font-medium px-2 py-1 rounded ${
              task.priority === "high"
                ? "bg-red-100 text-red-700"
                : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {task.priority || "low"}
          </div>

          <div className="text-xs text-gray-400 mt-2">{task.estimatedMinutes ? `${task.estimatedMinutes}m` : ""}</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-gray-500">
          {task.assignedTo?.name ? `Assigned: ${task.assignedTo.name}` : ""}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openNotes(task)}
            className="text-xs text-blue-600 hover:underline"
            type="button"
          >
            Notes
          </button>
        </div>
      </div>
    </motion.div>
  );
}
export default TaskCard