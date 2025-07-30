const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../database/users.json');

// Utility: Load users
function loadUsers() {
  if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]');
  return JSON.parse(fs.readFileSync(usersFile));
}

// Utility: Save users
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// POST /api/verify-email
router.post('/', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required.' });
  }

  const users = loadUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (user.emailVerified) {
    return res.status(400).json({ error: 'Email is already verified.' });
  }

  if (user.emailOTP !== otp) {
    return res.status(401).json({ error: 'Invalid OTP.' });
  }

  // Mark as verified and remove OTP
  user.emailVerified = true;
  delete user.emailOTP;

  saveUsers(users);

  return res.status(200).json({ message: 'Email verified successfully.' });
});

module.exports = router;
