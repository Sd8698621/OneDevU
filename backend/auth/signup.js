const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const usersFile = path.join(__dirname, '../database/users.json');

// Load users from JSON
function loadUsers() {
  if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]');
  return JSON.parse(fs.readFileSync(usersFile));
}

// Save users
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Email validation (simple)
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Unique username generator
function generateUsername(baseName, users) {
  let username = baseName.toLowerCase().replace(/\s+/g, '');
  let suffix = Math.floor(100 + Math.random() * 900);
  let uniqueUsername = username + suffix;

  while (users.some(u => u.username === uniqueUsername)) {
    suffix = Math.floor(100 + Math.random() * 900);
    uniqueUsername = username + suffix;
  }

  return uniqueUsername;
}

// POST /api/signup
router.post('/', async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    dob,
    gender,
    location,
    profile
  } = req.body;

  // Required checks
  if (!name || !email || !phone || !password || !dob || !gender || !location?.country || !location?.city) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  const users = loadUsers();

  // Unique checks
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already exists.' });
  }
  if (users.find(u => u.phone === phone)) {
    return res.status(409).json({ error: 'Phone number already exists.' });
  }

  // Generate unique username
  const username = generateUsername(name, users);

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Fixed OTP for testing
  const emailOTP = '12345678';

  const newUser = {
    id: Date.now(),
    name,
    username,
    email,
    phone,
    password: hashedPassword,
    dob,
    gender,
    location,
    profile: {
      photo: profile?.photo || '',
      banner: profile?.banner || '',
      headline: profile?.headline || '',
      education: profile?.education || '',
      work: profile?.work || '',
      skills: profile?.skills || [],
      bio: profile?.bio || '',
      interests: profile?.interests || []
    },
    followers: [],
    following: [],
    emailVerified: false,
    emailOTP,
    role: 'user',
    profileComplete: false,
    accountStatus: 'active',
    lastLogin: null,
    loginAttempts: 0,
    notifications: [],
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({
    message: 'Signup successful. Please verify your email.',
    userId: newUser.id,
    emailOTP // Show OTP in response for testing
  });
});

module.exports = router;
