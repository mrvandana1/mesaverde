require('dotenv').config();  // Ensure dotenv is loaded before other code
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const transactionRoutes=require("./routes/Transaction")
// const User = require("../models/User");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/Transaction", transactionRoutes);

mongoose.connect("mongodb+srv://vandanamohanaraj:Vandana1087@cluster0.w8m80jg.mongodb.net/se")
.then(() => console.log("MongoDB connected"))
.catch((error) => console.error("Error connecting to MongoDB:", error));

const PORT = 5000;
app.listen(PORT, "0.0.0.0",() => {
  console.log(process.env.JWT_SECRET); // This should not be undefined if the .env is loaded correctly

  console.log(`Server is running on http://localhost:${PORT}`);
});

