// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./pages/Home";
import EmployeeDashboard from "./pages/EmpDashboard";
import TaskManagerDashboard from "./pages/TaskmanagerDash";
import AdminDashboard from "./pages/AdminDashboard";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import DailyLog from "./pages/DailyLog";
import Productivity from "./pages/Productivity";
import Notifications from "./pages/Notification";
import ProductivityReport from "./pages/ProductivityReport";
import ApplyLeave from "./pages/ApplyLeave";
import PremiumFeatures from "./pages/Premiumfeatures";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminUsers from "./pages/Adminuser";
import AdminTasks from "./pages/Admintask";
import Attendance from "./pages/Attendance";
import TimeTracker from "./pages/TimeTracker";
import PremiumDashboard from "./pages/PremiumDash";
import Profile from "./pages/Profile";
import ManagerTaskList from "./pages/Mangertask";
import ManagerAddTask from "./pages/Mangeraddtask";
import ManagerLeaves from "./pages/managerleave";
import ManagerRecords from "./pages/managerrecord";
import AdminReports from "./pages/AdminReports";
import AdminRolePermissions from "./pages/AdminPermission";
import AdminDisputes from "./pages/AdminDispute";
import CreateDispute from "./pages/CreateDispute";
import Approval from "./pages/Approval";


function App() {
  return (
    <Router>
      <Routes>
        {/* Layout Parent Route */}
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Employee Routes */}
          <Route
            path="dashboard"
            element={
              <PrivateRoute roles={["user"]}>
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />
         
          <Route
            path="dailylog"
            element={
              <PrivateRoute roles={["user"]}>
                <DailyLog />
              </PrivateRoute>
            }
          />
          <Route
            path="productivity"
            element={
              <PrivateRoute roles={["user"]}>
                <Productivity />
              </PrivateRoute>
            }
          />
          <Route
            path="notifications"
            element={
              <PrivateRoute roles={["user"]}>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route
            path="productivityreport"
            element={
              <PrivateRoute roles={["user"]}>
                <ProductivityReport />
              </PrivateRoute>
            }
          />
          <Route
            path="apply-leave"
            element={
              <PrivateRoute roles={["user"]}>
                <ApplyLeave />
              </PrivateRoute>
            }
          />
          <Route
            path="premium"
            element={
              <PrivateRoute roles={["user"]}>
                <PremiumFeatures />
              </PrivateRoute>
            }
          />
          <Route
            path="success"
            element={
              <PrivateRoute roles={["user"]}>
                <PaymentSuccess />
              </PrivateRoute>
            }
          />

          {/* Manager Route */}
          <Route
            path="taskmanager"
            element={
              <PrivateRoute roles={["manager"]}>
                <TaskManagerDashboard />
              </PrivateRoute>
            }
          />

          {/* Admin Route */}
          <Route
            path="admin"
            element={
              <PrivateRoute roles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route path="admin/users" element={<AdminUsers />} />
                    <Route path="admin/tasks" element={<AdminTasks />} />
                    <Route path="leave" element={<ApplyLeave/>}/>
                    <Route path="attendance" element={<Attendance/>} />
                    <Route path="time" element={<TimeTracker/>}/>
                    <Route path="pricing" element={<Pricing/>}/>
                    <Route path="profile" element={<Profile/>}/>
                    <Route path="manager/tasks" element={<ManagerTaskList/>}/>
                   <Route path="manager/add-task" element={<ManagerAddTask/>}/>
                   <Route path="manager/leaves" element={<ManagerLeaves/>}/>
                               <Route path="manager/records" element={<ManagerRecords/>}/>
        
<Route path="admin/reports" element={<AdminReports/>}/>
<Route path="admin/approval" element={<Approval/>}/>

<Route path="admin/roles" element={<AdminRolePermissions/>}/>
<Route path="admin/disputes" element={<AdminDisputes/>}/>
<Route path="disputes/create" element={<CreateDispute/>}/>






                  
<Route
  path="premiumdashboard"
  element={
    <PrivateRoute roles={["user"]}>
      <PremiumDashboard />
    </PrivateRoute>
  }
/>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
