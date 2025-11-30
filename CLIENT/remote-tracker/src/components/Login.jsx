// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import { useAuth } from "../context/Authcontext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ AuthContext login

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", formData);

      // Save user & token in AuthContext
      login(res.data.user, res.data.token);

      alert("✅ Login Successful!");
      navigate("/dashboard");
    } catch (err) {
      alert("❌ Invalid credentials");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 
      bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md border border-white/20 
        rounded-2xl p-8 w-full max-w-sm shadow-2xl"
      >
        <h2 className="text-center text-3xl font-bold mb-6 bg-gradient-to-r 
          from-lime-300 to-teal-300 text-transparent bg-clip-text">
          Login
        </h2>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          required
          className="w-full px-4 py-3 mb-4 bg-black/20 text-white rounded-lg 
            focus:ring-2 focus:ring-teal-300 outline-none border border-white/20"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
          className="w-full px-4 py-3 mb-6 bg-black/20 text-white rounded-lg 
            focus:ring-2 focus:ring-teal-300 outline-none border border-white/20"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r 
            from-lime-400 to-teal-400 text-black font-semibold shadow-lg 
            hover:opacity-90 transition"
        >
          Login
        </button>

        {/* Register Link */}
        <p className="text-center mt-4 text-gray-300 text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-teal-300 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
