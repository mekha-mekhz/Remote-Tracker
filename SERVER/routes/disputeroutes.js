const express = require("express");
const router = express.Router();
const disputeController = require("../controllers/disputecontroller");
const auth = require("../middleware/auth");

// ====================== CREATE DISPUTE ======================
router.post("/create", auth.authuser, disputeController.createDispute);

// ====================== DISPUTE STATS (PLACE ABOVE :id !!!) ======================
router.get(
  "/stats/all",
  auth.authuser,
  auth.authorizeRoles("admin"),
  disputeController.getDisputeStats
);

// ====================== GET ALL DISPUTES ======================
router.get("/", auth.authuser, disputeController.getAllDisputes);

// ====================== GET SINGLE DISPUTE ======================
router.get("/:id", auth.authuser, disputeController.getDisputeById);

// ====================== UPDATE DISPUTE ======================
router.put("/:id", auth.authuser, disputeController.updateDispute);

// ====================== DELETE DISPUTE ======================
router.delete(
  "/:id",
  auth.authuser,
  auth.authorizeRoles("admin"),
  disputeController.deleteDispute
);

module.exports = router;
