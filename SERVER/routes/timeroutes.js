const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const timeController = require("../controllers/timecontroller");


router.post("/start", auth.authuser, timeController.startTimer);

router.put("/stop/:entryId", auth.authuser, timeController.stopTimer);


router.put("/ping/:entryId", auth.authuser, timeController.pingTimer);


router.get("/my", auth.authuser, timeController.getMyEntries);

router.get("/all", auth.authuser, timeController.getAllEntries);

module.exports = router;
