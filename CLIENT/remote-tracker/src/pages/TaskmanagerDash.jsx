// // // src/pages/ManagerDashboard.jsx
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../components/api";
// import { useAuth } from "../context/Authcontext";

// function TaskManagerDashboard() {
//   const { user } = useAuth();
//   const token = localStorage.getItem("token");

//   const [taskCount, setTaskCount] = useState(0);
//   const [leaveCount, setLeaveCount] = useState(0);
//   const [records, setRecords] = useState([]); // temporary local records
//   const [loading, setLoading] = useState(true);

//   // Load all counts
//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const [tasksRes, leavesRes] = await Promise.all([
//         api.get("/tasks", { headers: { Authorization: `Bearer ${token}` } }),
//         api.get("/leave/all", { headers: { Authorization: `Bearer ${token}` } }),
//       ]);

//       setTaskCount(tasksRes.data.tasks?.length || 0);
//       setLeaveCount(leavesRes.data.leaves?.length || 0);

//       // temporary action records
//       setRecords([
//         { id: 1, action: "Added", title: "Task A", time: "2025-12-03 10:30" },
//         { id: 2, action: "Deleted", title: "Task B", time: "2025-12-02 15:00" },
//       ]);
//     } catch (err) {
//       console.error("Failed to load dashboard data", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   if (loading) return <p className="p-6 text-gray-700">Loading dashboard...</p>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Manager Info */}
//       <div className="flex items-center gap-4 mb-6">
//         <img
//           src={user.profilePhoto || "/default.jpg"}
//           alt="Profile"
//           className="w-20 h-20 rounded-full border-4 border-blue-600 object-cover"
//         />
//         <div>
//           <h2 className="text-2xl font-bold">{user.name}</h2>
//             <h5 className="text-gray-600">{user.email}</h5>
//           <p className="text-gray-600">{user.role}</p>
//         </div>
//       </div>

//       {/* Dashboard Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Tasks */}
//         <Link
//           to="/manager/tasks"
//           className="bg-blue-500 text-white p-6 rounded-lg shadow hover:bg-blue-600 transition"
//         >
//           <h3 className="text-xl font-semibold mb-2">Tasks</h3>
//           <p className="text-3xl font-bold">{taskCount}</p>
//         </Link>

//         {/* Leave Requests */}
//         <Link
//           to="/manager/leaves"
//           className="bg-green-500 text-white p-6 rounded-lg shadow hover:bg-green-600 transition"
//         >
//           <h3 className="text-xl font-semibold mb-2">Leave Requests</h3>
//           <p className="text-3xl font-bold">{leaveCount}</p>
//         </Link>

//         {/* Action Records */}
//         <Link
//           to="/manager/records"
//           className="bg-purple-500 text-white p-6 rounded-lg shadow hover:bg-purple-600 transition"
//         >
//           <h3 className="text-xl font-semibold mb-2">Action Records</h3>
//           <p className="text-3xl font-bold">{records.length}</p>
//         </Link>
//  <Link
//           to="/manager/add-task"
//           className="bg-purple-500 text-white p-6 rounded-lg shadow hover:bg-purple-600 transition"
//         >
//           <h3 className="text-xl font-semibold mb-2"> Add Task</h3>
         
//         </Link>
        
//       </div>
//     </div>
//   );
// }

// export default TaskManagerDashboard;
// src/pages/ManagerDashboard.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../components/api";
import { useAuth } from "../context/Authcontext";

function TaskManagerDashboard() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [totalTasks, setTotalTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [inProgressTasks, setInProgressTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load all dashboard data
  const loadData = async () => {
    try {
      setLoading(true);

      const [tasksRes, leavesRes] = await Promise.all([
        api.get("/tasks", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/leave/all", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const tasks = tasksRes.data.tasks || [];

      setTotalTasks(tasks.length);
      setPendingTasks(tasks.filter((t) => t.status === "todo").length);
      setInProgressTasks(tasks.filter((t) => t.status === "in-progress").length);
      setCompletedTasks(tasks.filter((t) => t.status === "completed").length);

      setLeaveCount(leavesRes.data.leaves?.length || 0);

    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <p className="p-6 text-gray-700">Loading dashboard...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.profilePhoto || "/default.jpg"}
          alt="Profile"
          className="w-20 h-20 rounded-full border-4 border-blue-600 object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <h5 className="text-gray-600">{user.email}</h5>
          <p className="text-gray-600">{user.role}</p>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Tasks */}
        <Link
          to="/manager/tasks"
          className="bg-blue-500 text-white p-6 rounded-lg shadow hover:bg-blue-600 transition"
        >
          <h3 className="text-xl font-semibold mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold">{totalTasks}</p>
        </Link>

        {/* Pending Tasks */}
        <Link
          to="/manager/tasks?filter=pending"
          className="bg-yellow-500 text-white p-6 rounded-lg shadow hover:bg-yellow-600 transition"
        >
          <h3 className="text-xl font-semibold mb-2">Pending Tasks</h3>
          <p className="text-3xl font-bold">{pendingTasks}</p>
        </Link>

        {/* In Progress */}
        <Link
          to="/manager/tasks?filter=in-progress"
          className="bg-purple-500 text-white p-6 rounded-lg shadow hover:bg-purple-600 transition"
        >
          <h3 className="text-xl font-semibold mb-2">In Progress</h3>
          <p className="text-3xl font-bold">{inProgressTasks}</p>
        </Link>

        {/* Completed */}
        <Link
          to="/manager/tasks?filter=completed"
          className="bg-green-500 text-white p-6 rounded-lg shadow hover:bg-green-600 transition"
        >
          <h3 className="text-xl font-semibold mb-2">Completed</h3>
          <p className="text-3xl font-bold">{completedTasks}</p>
        </Link>

        {/* Leave Requests */}
        <Link
          to="/manager/leaves"
          className="bg-pink-500 text-white p-6 rounded-lg shadow hover:bg-pink-600 transition"
        >
          <h3 className="text-xl font-semibold mb-2">Leave Requests</h3>
          <p className="text-3xl font-bold">{leaveCount}</p>
        </Link>

        {/* Add Task */}
        <Link
          to="/manager/add-task"
          className="bg-indigo-500 text-white p-6 rounded-lg shadow hover:bg-indigo-600 transition"
        >
          <h3 className="text-xl font-semibold mb-2">Add New Task</h3>
          <p>Create tasks with details & priority</p>
        </Link>

        {/* Activity Log */}
        <Link
          to="/manager/records"
          className="bg-gray-800 text-white p-6 rounded-lg shadow hover:bg-black transition"
        >
          <h3 className="text-xl font-semibold mb-2">Activity Records</h3>
          <p>Track task actions & changes</p>
        </Link>

      </div>
    </div>
  );
}

export default TaskManagerDashboard;
