// import { Link } from "react-router-dom";

// function EmpDashboard() {
//   return (
//     <div className="p-6 min-h-screen bg-gray-100">
      
//       {/* Header */}
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">
//         Employee Dashboard
//       </h1>

//       {/* Dashboard Tiles */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

//         {/* Profile */}
//         <Link
//           to="/profile"
//           className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition border"
//         >
//           <h2 className="text-xl font-semibold text-gray-900">Work Profile</h2>
//           <p className="text-gray-500 mt-2">View and update your employee profile</p>
//         </Link>

//         {/* Time Tracker */}
//         <Link
//           to="/time"
//           className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition border"
//         >
//           <h2 className="text-xl font-semibold text-gray-900">Time Tracker</h2>
//           <p className="text-gray-500 mt-2">Track work hours in real-time</p>
//         </Link>

//         {/* Daily Activity Log */}
//         <Link
//           to="/daily-log"
//           className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition border"
//         >
//           <h2 className="text-xl font-semibold text-gray-900">Daily Activity Log</h2>
//           <p className="text-gray-500 mt-2">Log tasks and work activities</p>
//         </Link>

//         {/* Productivity Goals */}
//         <Link
//           to="/goals"
//           className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition border"
//         >
//           <h2 className="text-xl font-semibold text-gray-900">Productivity Goals</h2>
//           <p className="text-gray-500 mt-2">Set and track your goals</p>
//         </Link>

//         {/* Productivity Dashboard */}
//         <Link
//           to="/productivity"
//           className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition border"
//         >
//           <h2 className="text-xl font-semibold text-gray-900">Productivity Dashboard</h2>
//           <p className="text-gray-500 mt-2">Work time, task progress & usage data</p>
//         </Link>

//         {/* Tasks */}
//         <Link
//           to="/tasks"
//           className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition border"
//         >
//           <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
//           <p className="text-gray-500 mt-2">View, complete tasks & add notes</p>
//         </Link>

//         {/* Communication */}
//         <Link
//           to="/chat"
//           className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition border"
//         >
//           <h2 className="text-xl font-semibold text-gray-900">Communicate</h2>
//           <p className="text-gray-500 mt-2">Chat with manager about work</p>
//         </Link>

//         {/* Notifications */}
//         <Link
//           to="/notifications"
//           className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition border"
//         >
//           <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
//           <p className="text-gray-500 mt-2">Deadlines & task alerts</p>
//         </Link>

//         {/* Weekly & Monthly Reports */}
//         <Link
//           to="/reports"
//           className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition border"
//         >
//           <h2 className="text-xl font-semibold text-gray-900">Weekly & Monthly Reports</h2>
//           <p className="text-gray-500 mt-2">View detailed productivity reports</p>
//         </Link>

//       </div>
//     </div>
//   );
// }

// export default EmpDashboard;
import { Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

function EmpDashboard() {
  const { user } = useAuth();
  const isPremium = user?.premium;

  // A reusable locked tile component
  const LockedTile = ({ title, desc }) => (
    <div className="relative p-5 bg-white rounded-xl shadow border overflow-hidden">
      <div className="blur-sm pointer-events-none">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="text-gray-500 mt-2">{desc}</p>
      </div>
      
      {/* Overlay Lock */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <span className="bg-yellow-400 text-black px-3 py-1 rounded-full font-semibold shadow">
          🔒 Premium Only
        </span>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Employee Dashboard
      </h1>

      {/* Dashboard Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* Work Profile – Active */}
        <Link
          to="/profile"
          className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition border"
        >
          <h2 className="text-xl font-semibold text-gray-900">Work Profile</h2>
          <p className="text-gray-500 mt-2">View and update your employee profile</p>
        </Link>

        {/* Time Tracker – Active */}
        <Link
          to="/time"
          className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition border"
        >
          <h2 className="text-xl font-semibold text-gray-900">Time Tracker</h2>
          <p className="text-gray-500 mt-2">Track work hours in real-time</p>
        </Link>

        {/* All below – Locked unless premium */}
        {!isPremium ? (
          <>
            <LockedTile title="Daily Activity Log" desc="Log tasks and work activities" />
            <LockedTile title="Productivity Goals" desc="Set and track your goals" />
            <LockedTile title="Productivity Dashboard" desc="Work time & usage analytics" />
            <LockedTile title="My Tasks" desc="View and update tasks" />
            <LockedTile title="Communicate" desc="Chat with manager" />
            <LockedTile title="Notifications" desc="Deadlines & task alerts" />
            <LockedTile title="Weekly & Monthly Reports" desc="View detailed performance" />
          </>
        ) : (
          <>
            {/* PREMIUM USERS GET FULL ACCESS */}
            <Link to="/daily-log" className="tile">
              <h2 className="text-xl font-semibold">Daily Activity Log</h2>
              <p className="text-gray-500 mt-2">Log tasks and work activities</p>
            </Link>

            <Link to="/goals" className="tile">
              <h2 className="text-xl font-semibold">Productivity Goals</h2>
              <p className="text-gray-500 mt-2">Set and track your goals</p>
            </Link>

            <Link to="/productivity" className="tile">
              <h2 className="text-xl font-semibold">Productivity Dashboard</h2>
              <p className="text-gray-500 mt-2">Usage analytics</p>
            </Link>

            <Link to="/tasks" className="tile">
              <h2 className="text-xl font-semibold">My Tasks</h2>
              <p className="text-gray-500 mt-2">View & complete tasks</p>
            </Link>

            <Link to="/chat" className="tile">
              <h2 className="text-xl font-semibold">Communicate</h2>
              <p className="text-gray-500 mt-2">Chat with manager</p>
            </Link>

            <Link to="/notifications" className="tile">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <p className="text-gray-500 mt-2">Alerts & reminders</p>
            </Link>

            <Link to="/reports" className="tile">
              <h2 className="text-xl font-semibold">Weekly & Monthly Reports</h2>
              <p className="text-gray-500 mt-2">Performance analytics</p>
            </Link>
          </>
        )}

      </div>
    </div>
  );
}

export default EmpDashboard;
