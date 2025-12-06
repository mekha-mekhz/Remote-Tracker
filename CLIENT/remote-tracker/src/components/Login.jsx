import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import { useAuth } from "../context/Authcontext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("📨 Sending login request:", formData);

      const res = await api.post("/login", formData);

      console.log("✅ Login Response:", res.data);

      // Save token + user in context
      login(res.data.user, res.data.token);

      alert("Login Successful!");

      const role = res.data.user.role;

      // If user is premium → redirect to premium dashboard
      if (res.data.user.premium) {
        navigate("/premiumdashboard");
        return;
      }

      // Role-based redirects
      if (role === "admin") navigate("/admin");
      else if (role === "manager") navigate("/taskmanager");
      else navigate("/dashboard");

    } catch (err) {
      console.error("❌ Login Error:", err?.response?.data || err);

      alert(err?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
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

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full px-4 py-3 mb-4 bg-black/20 text-white rounded-lg 
          focus:ring-2 focus:ring-teal-300"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full px-4 py-3 mb-6 bg-black/20 text-white rounded-lg 
          focus:ring-2 focus:ring-teal-300"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r 
            from-lime-400 to-teal-400 text-black font-semibold shadow-lg 
            hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Login"}
        </button>

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
