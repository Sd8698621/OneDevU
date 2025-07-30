const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const usersFile = path.join(__dirname, '../database/users.json');
const FIXED_OTP = '12345678';

// Load users
function loadUsers() {
  if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]');
  return JSON.parse(fs.readFileSync(usersFile));
}

// Save users
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// POST /api/forgot-password → check if email exists
router.post('/', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const users = loadUsers();
  const user = users.find(u => u.email === email);

  if (!user) return res.status(404).json({ error: 'Email not found' });

  return res.json({ message: 'Email found. Please enter OTP to reset password.' });
});

// POST /api/forgot-password/reset-password → verify OTP & reset
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword)
    return res.status(400).json({ error: 'Email, OTP and new password are required' });

  if (otp !== FIXED_OTP)
    return res.status(400).json({ error: 'Invalid OTP' });

  const users = loadUsers();
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1)
    return res.status(404).json({ error: 'Email not found' });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[userIndex].password = hashedPassword;
    saveUsers(users);
    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
