const express=require('express')
const cookieParser = require("cookie-parser");
const app=express()
app.use(express.json())

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
require('dotenv').config()
const connectdb = require("./config/db");
const authuser = require("./routes/authroutes");
const taskRoutes=require("./routes/taskroutes")
const timeroutes=require("./routes/timeroutes")
const attendanceroutes=require("./routes/attendanceroutes")
const leaveroutes=require("./routes/leaveroutes")
const productivityroutes=require("./routes/dailreprtroutes")
const adminRoutes = require("./routes/adminroutes");
const notificationroutes=require("./routes/notificationRoutes")
const paymentRoutes=require("./routes/paymentroutes")
const planRoutes = require("./routes/planroutes");
const premiumRoutes=require("./routes/premiumroutes")
const disputeroutes=require("./routes/disputeroutes")
connectdb()
var cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.get("/",(req,res)=>{
res.send("WELCOME TO REMOTE WORK TRACKER ")
})

app.use("/api", authuser);
app.use("/api/tasks", taskRoutes)
app.use("/api/time",timeroutes)
app.use("/api/attendance",attendanceroutes)
app.use("/api/leave",leaveroutes)
app.use("/api/productivity",productivityroutes)
app.use("/admin", adminRoutes);
app.use("/api/notifications",notificationroutes)
app.use("/api/pay", paymentRoutes);
app.use("/api/premium",premiumRoutes)
app.use("/api/disputes",disputeroutes)


app.use("/api/plans", planRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`Listening to port number http://localhost:${process.env.PORT}`);

})
