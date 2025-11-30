import React from "react";
import { motion } from "framer-motion";
import HeroImage from "../assets/hmepage.jpg";

function HomePage() {
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[75vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        
        {/* Hero Image */}
        <img
          src={HeroImage}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-6 md:px-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Boost Your Remote Productivity
            <br /> Stay Motivated. Achieve More. 🚀
          </h1>

          <p className="text-white/90 mb-6 text-lg drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
            Track tasks, monitor progress, and manage your remote team with
            clarity and confidence — every day.
          </p>

          <div className="flex gap-4 mt-4">
            <a
              href="/register"
              className="bg-white text-emerald-700 px-7 py-3 rounded-xl font-semibold hover:bg-lime-100 transition shadow-lg"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="border border-white text-white px-7 py-3 rounded-xl font-semibold hover:bg-white/20 transition shadow-lg"
            >
              Login
            </a>
          </div>
        </motion.div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="px-10 md:px-20 py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
        <h3 className="text-3xl font-extrabold text-center mb-16 drop-shadow-lg">
          Powerful Tools to Improve Remote Team Efficiency
        </h3>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              title: "⏰ Time Tracking",
              desc: "Monitor working hours, breaks, and daily productivity with ease.",
            },
            {
              title: "📊 Smart Analytics",
              desc: "Understand performance trends with AI-powered insights.",
            },
            {
              title: "💬 Team Collaboration",
              desc: "Stay connected with your team, no matter where they are.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white/10 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition border border-white/20 backdrop-blur-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <h4 className="text-xl font-semibold text-white mb-2 drop-shadow-md">
                {feature.title}
              </h4>
              <p className="text-white/80 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

export default HomePage;
