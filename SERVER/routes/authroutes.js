const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/authcontroller");
const auth=require('../middleware/auth')
const upload = require('../middleware/upload');

router.post("/register", upload.single("profilePhoto"), authcontroller.createUser);  
router.post("/login", authcontroller.loginUser);


router.get('/logout',authcontroller.logoutUser)

router.get("/me", auth.authuser, authcontroller.getLoggedUser);
router.get(
  "/admin/dashboard",
  auth.authuser,
  auth.authorizeRoles("admin"),
  authcontroller.adminDashboard
);


module.exports = router;
