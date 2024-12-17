// const express = require("express");
// const { register, login } = require("../controllers/authController");

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

// module.exports = router;


const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const router = express.Router();

// Register User (store plaintext password)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user and store the password as plaintext (not secure)
  const user = new User({ email, password });

  try {
    const newUser = await user.save();
    res.status(201).json({
      message: 'User created successfully',
      userId: newUser._id,
      emailId: email,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
});

// User Login (compare plaintext password)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Compare password (plaintext)
  if (user.password !== password) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Create JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Token will expire in 1 hour
  );

  res.status(200).json({
    message: 'Login successful',
    token,
  });
});

module.exports = router;
