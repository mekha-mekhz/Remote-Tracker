import React, { useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
    role: "user",
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
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));

      await api.post("/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Registered Successfully!");
      navigate("/login");
    } catch (err) {
      alert("❌ Registration failed");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 
      bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">

      <form
        onSubmit={submit}
        className="bg-white/10 backdrop-blur-md border border-white/20 
        rounded-2xl p-8 w-full max-w-sm shadow-2xl"
      >
        <h2 className="text-center text-3xl font-bold mb-6 bg-gradient-to-r 
          from-lime-300 to-teal-300 text-transparent bg-clip-text">
          Register
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="w-full px-4 py-3 mb-4 bg-black/20 text-white rounded-lg 
          focus:ring-2 focus:ring-teal-300 border border-white/20"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full px-4 py-3 mb-4 bg-black/20 text-white rounded-lg 
          focus:ring-2 focus:ring-teal-300 border border-white/20"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full px-4 py-3 mb-4 bg-black/20 text-white rounded-lg 
          focus:ring-2 focus:ring-teal-300 border border-white/20"
        />

        {/* Position */}
        <input
          type="text"
          name="position"
          placeholder="Position (e.g., Remote Developer)"
          onChange={handleChange}
          className="w-full px-4 py-3 mb-4 bg-black/20 text-white rounded-lg 
          focus:ring-2 focus:ring-teal-300 border border-white/20"
        />

        {/* Profile Photo */}
        <div className="w-full mb-4">
          <input
            type="file"
            id="profilePhoto"
            name="profilePhoto"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />

          <label
            htmlFor="profilePhoto"
            className="block w-full bg-black/20 border border-white/20 
            rounded-lg px-3 py-3 text-sm cursor-pointer hover:bg-white/10"
          >
            Upload Profile Photo
          </label>

          {formData.profilePhoto && (
            <p className="text-xs text-lime-300 mt-1">
              Selected: {formData.profilePhoto.name}
            </p>
          )}
        </div>

        {/* Role */}
        <select
          name="role"
          onChange={handleChange}
          className="w-full px-4 py-3 mb-6 bg-black/20 text-white rounded-lg 
          focus:ring-2 focus:ring-teal-300 border border-white/20"
        >
          <option value="user">User</option>
          <option value="manager">Task Manager</option>
          <option value="admin">Admin</option>
        </select>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r 
          from-lime-400 to-teal-400 text-black font-semibold shadow-lg 
          hover:opacity-90 transition"
        >
          Register
        </button>

        <p className="text-center mt-4 text-gray-300 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-teal-300 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;
