import React from "react";
import { useAuth } from "../context/Authcontext";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51SYL0BBdzuY7Xu2UDh6062TbbMAZfsjsobTlCJIP3X6M0owdbwJ6kxMIa8aOcdO9YOZSynu9LLAuRE0YeTX28kzw001TcodPha"
);

function Pricing() {
  const { user, token } = useAuth();

  const handlePayment = async (planId) => {
  if (!user) {
    alert("Please login to purchase a plan");
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/api/pay/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ planId }),
    });

    const data = await res.json();

    if (!data.url) {
      alert("Payment session failed: " + data.error);
      return;
    }

    // ⭐ NEW METHOD — works with the new Stripe version
    window.location.href = data.url;

  } catch (err) {
    console.error("Payment request failed:", err);
    alert("Payment failed: " + err.message);
  }
};


  const plans = [
    {
      _id: "692c3d4bbf6444979b405ec3",
      name: "Starter",
      price: 299,
      features: ["Basic attendance", "Daily check-in/check-out", "Limited dashboard access", "Email support"],
    },
    {
      _id: "692c3d93bf6444979b405ec5",
      name: "Premium",
      price: 799,
      features: ["Real-time attendance", "GPS logs", "Daily & weekly reports", "Leave management", "Export reports", "Priority support"],
    },
    {
      _id: "692c3daabf6444979b405ec7",
      name: "Enterprise",
      price: 1499,
      features: ["All Premium Features", "Advanced analytics", "Multiple admins", "Custom roles", "HRMS integration", "Dedicated account manager"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <h1 className="text-3xl font-bold text-center mb-10">Pricing Plans</h1>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div key={plan._id} className="p-6 rounded-2xl shadow-xl border bg-gray-900 border-gray-800">
            <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-gray-400 mb-4">₹{plan.price}/month</p>
            <ul className="text-gray-300 mb-6">
              {plan.features.map((f, idx) => (
                <li key={idx} className="mb-1">• {f}</li>
              ))}
            </ul>
            <button
              onClick={() => handlePayment(plan._id)}
              className="w-full px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-xl font-semibold transition"
            >
              Buy {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
