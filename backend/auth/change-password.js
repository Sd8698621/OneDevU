const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = 'yourSuperSecretKey123'; // Replace with process.env.JWT_SECRET if using dotenv
const usersFile = path.join(__dirname, '../database/users.json');

// Load users from file
function loadUsers() {
  if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]');
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

// Save users to file
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Route: POST /api/change-password
router.post('/', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  const { newPassword } = req.body;

  if (!token) return res.status(401).json({ error: 'Token missing' });
  if (!newPassword) return res.status(400).json({ error: 'New password is required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = loadUsers();

    const userIndex = users.findIndex(u => u.id === decoded.id);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    users[userIndex].password = bcrypt.hashSync(newPassword, 10);
    saveUsers(users);

    return res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('JWT or save error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
