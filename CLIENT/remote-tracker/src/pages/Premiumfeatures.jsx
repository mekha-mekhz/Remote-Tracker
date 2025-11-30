import React from "react";
import { Lock } from "lucide-react";
import { useAuth } from "../context/Authcontext";
import { Link } from "react-router-dom";

function Premiumfeatures() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const premium = user?.isPremium;

  const features = [
    { title: "Advanced Productivity Analytics", desc: "Get detailed charts & insights about your work patterns." },
    { title: "Download Work Reports (PDF)", desc: "Export weekly/monthly reports with one click." },
    { title: "Unlimited Projects & Tasks", desc: "Remove all usage limits." },
    { title: "AI Productivity Assistant", desc: "Smart suggestions to improve workflow." },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <h1 className="text-3xl font-bold text-center mb-10">Premium Features</h1>

      {premium ? (
        <div className="text-center mb-8">
          <span className="px-4 py-2 bg-emerald-600 rounded-full text-sm shadow-lg">⭐ You are a Premium User</span>
        </div>
      ) : (
        <div className="text-center mb-8">
          <p className="text-gray-300">Unlock all advanced features</p>
          <Link
            to="/pricing"
            className="mt-3 inline-block px-6 py-2 bg-teal-500 hover:bg-teal-600 rounded-xl font-semibold transition"
          >
            Upgrade to Premium
          </Link>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {features.map((f, idx) => (
          <div
            key={idx}
            className={`relative p-6 rounded-2xl shadow-xl border ${
              premium ? "bg-gray-800 border-gray-700" : "bg-gray-900 border-gray-800 opacity-60"
            }`}
          >
            {!premium && (
              <div className="absolute top-3 right-3 text-gray-400" title="Premium feature">
                <Lock size={20} aria-label="Locked feature" />
              </div>
            )}
            <h2 className="text-xl font-semibold">{f.title}</h2>
            <p className="text-gray-400 mt-2">{f.desc}</p>
            {premium ? (
              <button className="mt-4 px-4 py-2 bg-emerald-600 rounded-lg">Open Feature</button>
            ) : (
              <button className="mt-4 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg cursor-not-allowed">
                Locked
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Premiumfeatures;
