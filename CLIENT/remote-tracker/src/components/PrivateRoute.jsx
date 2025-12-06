// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

 function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />; // not logged in

  if (roles && !roles.includes(user.role)) {
    // user doesn't have required role
    if (user.role === "user") return <Navigate to="/dashboard" />;
    if (user.role === "manager") return <Navigate to="/taskmanager" />;
    if (user.role === "admin") return <Navigate to="/admin" />;
    return <Navigate to="/" />;
  }

  return children;
}
export default PrivateRoute