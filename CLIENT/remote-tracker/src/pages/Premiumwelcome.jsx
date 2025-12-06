// src/pages/PremiumWelcome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function PremiumWelcome() {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/premiumdashboard"); // Route to your premium dashboard page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-3xl font-bold mb-4">🎉 Welcome to Premium!</h1>
        <p className="mb-6 text-gray-700">
          Thank you for upgrading. You now have access to exclusive features including detailed reports, attendance tracking, leaves overview, and productivity analytics.
        </p>
        <button
          onClick={goToDashboard}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default PremiumWelcome;
