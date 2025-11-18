import React, { useState } from "react";
import api from "./api"; 
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handle = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", formData);

      // ✅ Save token and user role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);

      alert("✅ Login Successful!");
      navigate("/dashboard"); // redirect to dashboard
    } catch (err) {
      alert("❌ Invalid credentials");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        fontFamily: "Arial",
        background: "#f3f7ff",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          background: "#fff",
          padding: "35px",
          borderRadius: "12px",
          width: "340px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#004aad",
          }}
        >
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handle}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            borderRadius: "6px",
            border: "1px solid #b7cbe6",
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handle}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "18px",
            borderRadius: "6px",
            border: "1px solid #b7cbe6",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#004aad",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#00368a")}
          onMouseLeave={(e) => (e.target.style.background = "#004aad")}
        >
          Login
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "12px",
            fontSize: "14px",
          }}
        >
          Don’t have an account?{" "}
          <a href="/register" style={{ color: "#004aad", textDecoration: "none" }}>
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
