const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../database/users.json');

function loadUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

router.get('/', (req, res) => {
  const query = req.query.query?.toLowerCase();
  if (!query) return res.status(400).json({ error: 'Query is required' });

  const users = loadUsers();
  const results = users.filter(u =>
    u.name.toLowerCase().includes(query) ||
    u.username.toLowerCase().includes(query) ||
    u.email.toLowerCase().includes(query)
  ).map(u => ({
    id: u.id,
    name: u.name,
    username: u.username,
    email: u.email,
    profile: u.profile
  }));

  res.json({ results });
});

module.exports = router;
