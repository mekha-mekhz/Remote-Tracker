// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

// 1️⃣ Create Context
const AuthContext = createContext();

// 2️⃣ AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage if exists
    return JSON.parse(localStorage.getItem("loggedInUser")) || null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // ✅ Login function
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
  };

  // ✅ Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
  };

  // Optional: function to update user (like when upgrading to premium)
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
  };

  // 3️⃣ Provide context values
  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4️⃣ Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
