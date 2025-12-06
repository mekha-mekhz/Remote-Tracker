// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import api from "../components/api";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
function PaymentSuccess() {

    const { user } = useAuth();
    const token = localStorage.getItem("token");
    const [upgraded, setUpgraded] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const goToDashboard = () => {
        navigate("/premiumdashboard"); // Route to your premium dashboard page
    };

    useEffect(() => {
        const upgradeUser = async () => {
            try {
                const res = await api.post(
                    "/upgrade",
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setUpgraded(true);
            } catch (err) {
                console.error("Upgrade error:", err);
                setUpgraded(false);
            } finally {
                setLoading(false);
            }
        };

        upgradeUser();
    }, [token]);

    if (loading) return <p className="p-6">Processing your payment...</p>;

   return (
  <div className="p-6">
    {upgraded ? (
      <>
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p>Welcome {user?.name}, your account is now upgraded to Premium.</p>
        <p>You can now access premium features like Daily Logs, Productivity Reports, and Attendance History.</p>

        <button
          onClick={goToDashboard}
          className="bg-green-600 text-white mt-6 px-6 py-3 rounded hover:bg-green-700 transition"
        >
          Go to Premium Dashboard
        </button>
      </>
    ) : (
      <>
        <h1 className="text-3xl font-bold mb-4 text-red-600">Upgrade Failed</h1>
        <p>Please contact support if your payment was successful but your account is not upgraded.</p>

        <button
          onClick={goToDashboard}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </button>
      </>
    )}
  </div>
);

}

export default PaymentSuccess;
