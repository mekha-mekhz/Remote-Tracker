import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register"
import Login from "./components/Login";
import Home from "./pages/Home";
import EmployeeDashboard from "./pages/EmpDashboard";
import TaskBoard from "./pages/TaskBoard";
import DailyLog from "./pages/DailyLog";
import Productivity from "./pages/Productivity";
import Notifications from "./pages/Notification";
import ProductivityReport from "./pages/ProductivityReport";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<EmployeeDashboard />} />
        <Route path="/tasks" element={<TaskBoard />} />
        <Route path="/dailylog" element={<DailyLog />} />
        <Route path="/productivity" element={<Productivity />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/productivityreport" element={<ProductivityReport />} />





      </Routes>
    </Router>
  );
}

export default App;
