import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

function ProductivityReport() {
  const [view, setView] = useState("weekly");

  const weeklyData = [
    { day: "Mon", hours: 5 },
    { day: "Tue", hours: 6 },
    { day: "Wed", hours: 4 },
    { day: "Thu", hours: 7 },
    { day: "Fri", hours: 3 },
    { day: "Sat", hours: 0 },
    { day: "Sun", hours: 0 },
  ];

  const monthlyData = [
    { week: "Week 1", hours: 18 },
    { week: "Week 2", hours: 22 },
    { week: "Week 3", hours: 16 },
    { week: "Week 4", hours: 25 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        📊 Productivity Reports
      </h1>

      {/* Switch Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setView("weekly")}
          className={`px-4 py-2 rounded-lg ${
            view === "weekly"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border"
          }`}
        >
          Weekly
        </button>

        <button
          onClick={() => setView("monthly")}
          className={`px-4 py-2 rounded-lg ${
            view === "monthly"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border"
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Weekly Chart */}
      {view === "weekly" && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-3">
            Weekly Productivity (Hours)
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monthly Chart */}
      {view === "monthly" && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-3">
            Monthly Productivity (Hours)
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default ProductivityReport;
