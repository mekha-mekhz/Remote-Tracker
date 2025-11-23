import React from "react";
import { motion } from "framer-motion";

function HomePage() {
  return (
    <div className="font-sans bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* ===== Navbar ===== */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-blue-600">RemoteTrack</h1>
        <div className="space-x-6">
          <a href="/" className="text-gray-700 hover:text-blue-600 transition">Home</a>
          <a href="/dashboard" className="text-gray-700 hover:text-blue-600 transition">Dashboard</a>
          <a href="/tasks" className="text-gray-700 hover:text-blue-600">Tasks</a>

          <a href="/login" className="text-gray-700 hover:text-blue-600 transition">Login</a>
          <a
            href="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Register
          </a>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <motion.section
        className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            Track Your Team’s Remote Productivity Effortlessly 🚀
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Manage remote work, monitor tasks, and boost performance — all in one place.
          </p>
          <div className="space-x-4">
            <a
              href="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-100 transition"
            >
              Login
            </a>
          </div>
        </div>

        <motion.img
          src="https://cdn-icons-png.flaticon.com/512/826/826070.png"
          alt="Productivity Illustration"
          className="w-72 md:w-96 mt-10 md:mt-0"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        />
      </motion.section>

      {/* ===== Features Section ===== */}
      <section className="px-10 md:px-20 py-16 bg-blue-50">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose RemoteTrack?
        </h3>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "⏰ Time Tracking",
              desc: "Monitor daily productivity hours and ensure efficient workflows.",
            },
            {
              title: "📊 Performance Analytics",
              desc: "Get detailed insights into task progress and employee efficiency.",
            },
            {
              title: "💬 Collaboration Tools",
              desc: "Communicate seamlessly and manage remote teams with ease.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <h4 className="text-xl font-semibold text-blue-600 mb-2">
                {f.title}
              </h4>
              <p className="text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="text-center py-6 bg-white shadow-inner text-gray-600">
        © {new Date().getFullYear()} <span className="font-semibold text-blue-600">RemoteTrack</span> — Built for Smart Remote Teams.
      </footer>
    </div>
  );
}

export default HomePage;
