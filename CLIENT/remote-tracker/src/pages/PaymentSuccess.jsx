import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const upgradeUser = async () => {
      try {
        if (!user || !token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:8000/api/users/upgrade", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.user) {
          updateUser(data.user); 
          navigate("/premium-features");
        } else {
          alert(data.error || "Failed to upgrade user.");
          navigate("/pricing");
        }

      } catch (err) {
        console.error("Upgrade error:", err);
        alert("Failed to upgrade user: " + err.message);
        navigate("/pricing");
      } finally {
        setProcessing(false);
      }
    };

    upgradeUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-gray-950">
      <div className="text-center p-6 bg-gray-800 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Payment Successful! 🎉</h1>
        <p className="text-gray-300">
          {processing ? "Processing your upgrade..." : "Redirecting..."}
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccess;
