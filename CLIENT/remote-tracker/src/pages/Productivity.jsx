import React, { useEffect, useState } from "react";
import api from "../components/api";
import { motion } from "framer-motion";

export default function Productivity() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    title: "",
    targetHours: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/goals");
      setGoals(res.data.goals || []);
    } catch (err) {
      console.error("Failed to load goals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const addGoal = async (e) => {
    e.preventDefault();
    try {
      await api.post("/goals", form);
      setForm({ title: "", targetHours: "" });
      fetchGoals();
    } catch (err) {
      console.error("Failed to add goal:", err);
    }
  };

  const updateProgress = async (goalId, newValue) => {
    try {
      await api.put(`/goals/${goalId}`, { progress: newValue });
      fetchGoals();
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-2xl font-bold mb-6">Productivity Goals</h1>

        {/* Add Goal Form */}
        <form onSubmit={addGoal} className="bg-white p-5 rounded-xl shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Create Goal</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              className="p-3 border rounded"
              placeholder="Goal Title (ex: Learn React, Finish Module)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              type="number"
              className="p-3 border rounded"
              placeholder="Target Hours"
              value={form.targetHours}
              onChange={(e) => setForm({ ...form, targetHours: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Goal
          </button>
        </form>

        {/* Goal List */}
        <h2 className="text-xl font-semibold mb-4">My Goals</h2>

        {loading ? (
          <div className="text-center py-5">Loading goals...</div>
        ) : (
          <div className="space-y-5">
            {goals.map((goal) => {
              const progressPercent = Math.min(
                (goal.progress / goal.targetHours) * 100,
                100
              );

              return (
                <motion.div
                  key={goal._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-4 rounded-xl shadow"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      <p className="text-sm mt-1">
                        {goal.progress} / {goal.targetHours} hours
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-gray-200 rounded mt-4 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>

                  {/* Update Progress */}
                  <div className="mt-4 flex gap-4 items-center">
                    <input
                      type="number"
                      className="p-2 border rounded w-32"
                      value={goal.progress}
                      onChange={(e) =>
                        updateProgress(goal._id, Number(e.target.value))
                      }
                      min="0"
                      max={goal.targetHours}
                    />
                    <span className="text-gray-500 text-sm">
                      Update Hours Completed
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
