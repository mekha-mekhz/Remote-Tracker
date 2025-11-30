import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./pages/Home";
import EmployeeDashboard from "./pages/EmpDashboard";
import TaskBoard from "./pages/TaskBoard";
import DailyLog from "./pages/DailyLog";
import Productivity from "./pages/Productivity";
import Notifications from "./pages/Notification";
import ProductivityReport from "./pages/ProductivityReport";
import ApplyLeave from "./pages/ApplyLeave";
import AdminDashboard from "./pages/AdminDashboard";
import Layout from "./components/Layout";
import PremiumFeatures from "./pages/Premiumfeatures";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";

function App() {
  return (
    <Router>
      <Routes>

        {/* Layout Parent Route */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />  {/* default page inside Layout */}
          
          {/* Public Routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Employee Routes */}
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="tasks" element={<TaskBoard />} />
          <Route path="dailylog" element={<DailyLog />} />
          <Route path="productivity" element={<Productivity />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="productivityreport" element={<ProductivityReport />} />
          <Route path="apply-leave" element={<ApplyLeave />} />
<Route path="premium" element={<PremiumFeatures/>}/>
<Route path="success" element={<PaymentSuccess />} />
   <Route path="pricing" element={<Pricing />} />
          {/* Admin Route */}
          <Route path="admin" element={<AdminDashboard />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
