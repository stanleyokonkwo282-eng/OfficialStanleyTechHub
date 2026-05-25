const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/users — save user after Firebase signup
router.post("/", async (req, res) => {
  try {
    const { email, name, photoURL } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    const newUser = new User({ email, name, photoURL });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/:email — fetch user by email (fixes admin role detection)
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;