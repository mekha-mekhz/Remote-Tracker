import React, { useEffect, useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import api from "../components/api"; // your axios instance
import { motion } from "framer-motion";

/*
  Assumptions:
  - GET /api/tasks  => returns { tasks: [ ... ] } with populated assignedTo/createdBy if backend does so
  - PUT /api/tasks/:id or PUT /api/tasks/status/:id => update task (we use /api/tasks/status/:id here)
*/

const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

 function TaskBoard() {
  const [columns, setColumns] = useState({
    todo: [],
    in_progress: [],
    done: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks"); // adjust path if your route is /api/tasks or /api/tasks/user
      const tasks = res.data.tasks || res.data; // accept both shapes

      // Put tasks into columns
      const colMap = { todo: [], in_progress: [], done: [] };
      tasks.forEach((t) => {
        const s = t.status || "todo";
        if (!colMap[s]) colMap[s] = [];
        colMap[s].push(t);
      });

      setColumns(colMap);
    } catch (err) {
      console.error("Failed to load tasks:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // When drag ends, update local state and call API to persist status
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // moved within same column and same index
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const startCol = source.droppableId;
    const endCol = destination.droppableId;

    const startTasks = Array.from(columns[startCol]);
    const [moved] = startTasks.splice(source.index, 1);

    // if moved within same col
    if (startCol === endCol) {
      startTasks.splice(destination.index, 0, moved);
      setColumns((prev) => ({ ...prev, [startCol]: startTasks }));
      return;
    }

    // moving to different column
    const endTasks = Array.from(columns[endCol]);
    // update task status locally
    moved.status = endCol;
    endTasks.splice(destination.index, 0, moved);

    setColumns((prev) => ({ ...prev, [startCol]: startTasks, [endCol]: endTasks }));

    // Persist to backend
    try {
      await api.put(`/tasks/status/${moved._id}`, { status: endCol });
      // optional: refetch to confirm
      // await fetchTasks();
    } catch (err) {
      console.error("Failed to update task status:", err.response?.data || err.message);
      // revert UI change on failure
      await fetchTasks();
    }
  };

  // open notes modal
  const openNotes = (task) => {
    setSelectedTask(task);
    setNoteText(task.notes || "");
  };

  const closeNotes = () => {
    setSelectedTask(null);
    setNoteText("");
  };

  const saveNotes = async () => {
    if (!selectedTask) return;
    setSavingNote(true);
    try {
      await api.put(`/tasks/${selectedTask._id}`, { notes: noteText }); // update notes
      // update local
      await fetchTasks();
      closeNotes();
    } catch (err) {
      console.error("Failed to save notes:", err.response?.data || err.message);
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Tasks — Kanban Board</h1>
          <div>
            <button
              onClick={fetchTasks}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading tasks...</div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COLUMNS.map((col) => (
                <div key={col.id} className="flex flex-col">
                  <h3 className="text-lg font-medium mb-3">{col.title}</h3>

                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] p-3 rounded-lg transition ${
                          snapshot.isDraggingOver ? "bg-blue-50" : "bg-white/50"
                        } border border-gray-100`}
                      >
                        {columns[col.id].map((task, idx) => (
                          <Draggable key={task._id} draggableId={task._id} index={idx}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-3"
                              >
                                <TaskCard task={task} openNotes={openNotes} />
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>

      {/* Notes / Details modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-2xl bg-white rounded-lg p-6 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{selectedTask.title}</h2>
                <p className="text-sm text-gray-500">{selectedTask.description}</p>
              </div>
              <button className="text-gray-500" onClick={closeNotes}>
                Close
              </button>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Notes / Progress</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={6}
                className="w-full mt-2 p-3 border rounded-md"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeNotes}
                className="px-4 py-2 rounded-md border"
              >
                Cancel
              </button>
              <button
                onClick={saveNotes}
                className="px-4 py-2 rounded-md bg-blue-600 text-white"
                disabled={savingNote}
              >
                {savingNote ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
export default TaskBoard