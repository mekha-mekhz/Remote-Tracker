import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext"; // adjust path if needed
import "@fontsource/montserrat";

 function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Theme toggle
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isPremium = user?.premium === true;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 shadow-lg bg-gray-900 text-white transition-all">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-wide drop-shadow-lg text-lime-400"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          🕒 Remote Tracker
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center text-lg font-semibold">
          <Link to="/" className="hover:text-lime-300 transition duration-300">Home</Link>

          {/* Premium */}
          {!isPremium ? (
            <Link to="/premium" className="px-4 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-md hover:opacity-90 transition">
              ⭐ Go Premium
            </Link>
          ) : (
            <span className="px-4 py-1 bg-yellow-600 text-black rounded-md font-bold">
              ⭐ Premium User
            </span>
          )}

          {user ? (
            <button onClick={handleLogout} className="px-4 py-1 bg-red-700 text-white rounded-md hover:bg-red-800 transition">
              Logout
            </button>
          ) : (
            <Link to="/login" className="px-4 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition">
              Login
            </Link>
          )}

          <button onClick={toggleTheme} className="ml-4 px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 transition">
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-3xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden flex flex-col gap-4 p-6 bg-gray-800/90 backdrop-blur-md text-white font-semibold rounded-b-lg">
          <Link to="/" className="hover:text-lime-300 transition">Home</Link>

          {!isPremium ? (
            <Link to="/premium" className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-md hover:opacity-90 transition">
              ⭐ Go Premium
            </Link>
          ) : (
            <span className="px-4 py-2 bg-yellow-600 text-black rounded-md font-bold">⭐ Premium User</span>
          )}

          {user ? (
            <button onClick={handleLogout} className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition">
              Logout
            </button>
          ) : (
            <Link to="/login" className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition">
              Login
            </Link>
          )}

          <button onClick={toggleTheme} className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition">
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </ul>
      )}
    </nav>
  );
}
export default Navbar