const stripe = require("../config/stripe");
const Plan = require("../models/plan");

exports.createCheckoutSession = async (req, res) => {
  try {
    const { planId } = req.body;

    // 1️⃣ Validate planId
    if (!planId) {
      return res.status(400).json({ error: "planId is required" });
    }

    // 2️⃣ Fetch plan
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    // 3️⃣ Validate price
    const amount = parseInt(plan.price);
    if (isNaN(amount)) {
      return res.status(400).json({ error: "Plan price is invalid" });
    }

    // 4️⃣ Create Stripe checkout session (2025 Clover Update Compatible)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: plan.name },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],

      ui_mode: "hosted",

      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    // 5️⃣ Return URL instead of sessionId (Stripe 2025 requirement)
    res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ error: err.message });
  }
};
