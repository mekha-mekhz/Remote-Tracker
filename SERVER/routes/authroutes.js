const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/authcontroller");
const auth=require('../middleware/auth')
router.post("/register", authcontroller.createUser);
router.post("/login", authcontroller.loginUser);

router.get('/admin/dashboard',auth.authuser,auth.authorizeRoles('admin'),authcontroller.adminDashboard)
router.get('/logout',authcontroller.logoutUser)
module.exports = router;
