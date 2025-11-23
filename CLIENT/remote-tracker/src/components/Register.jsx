import React, { useState } from "react";
import api from "./api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    
    password: "",
    usertype: "user",
    position: "",
    profilePhoto: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto") {
      setFormData({ ...formData, profilePhoto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      // Use FormData to handle image upload
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const res = await api.post("/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Registered Successfully");
      console.log(res.data);
    } catch (err) {
      console.error("❌ Registration failed:", err.response?.data || err.message);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #b7cbe6",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        fontFamily: "Arial",
        background: "#eaf4ff",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          background: "#ffffff",
          padding: "35px",
          borderRadius: "12px",
          width: "350px",
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
          Register
        </h2>

        <label>Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={inputStyle}
        />

      

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label>Position</label>
        <input
          type="text"
          name="position"
          placeholder="e.g. Remote Developer"
          onChange={handleChange}
          style={inputStyle}
        />

    <label className="text-sm font-medium">Profile Photo</label>

<div className="w-full">
  {/* Hidden File Input */}
  <input
    type="file"
    id="profilePhoto"
    name="profilePhoto"
    accept="image/*"
    onChange={handleChange}
    className="hidden"
  />

  {/* Custom Button */}
  <label
    htmlFor="profilePhoto"
    className="block w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-gray-200"
  >
    Upload Profile Photo
  </label>

  {/* Show selected file name */}
  {formData.profilePhoto && (
    <p className="text-xs text-green-600 mt-1">
      Selected: {formData.profilePhoto.name}
    </p>
  )}
</div>

        <label>User Type</label>
        <select
          name="usertype"
          onChange={handleChange}
          style={inputStyle}
        >
            <option value="user">User</option>
          <option value="taskmanager">Task Manager</option>
          <option value="admin">Admin</option>
        </select>

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
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
