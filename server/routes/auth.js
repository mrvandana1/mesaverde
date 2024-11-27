const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();


// Signup route
router.post("/signup", async (req, res) => {
  console.log("POST /signup hit");
  try {
    const { name, email, phoneNumber, accountNumber, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !phoneNumber || !accountNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the user already exists (by email or phone number)
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or phone number already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password
    const user = new User({
      name,
      email,
      phoneNumber,
      accountNumber,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    // Send success response
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error });
  }
});

// Login route
router.post("/login", async (req, res) => {
  console.log("POST /login hit");
  try {
    const { email, password } = req.body;

    // Check if the user exists by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send back the token and user data (excluding password)
    res.status(200).json({
      token,
      user: { name: user.name, email: user.email, phoneNumber: user.phoneNumber, accountNumber: user.accountNumber },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error logging in" });
  }
});


module.exports = router;
