const express = require('express');
const router = express.Router();
const { followUser } = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../database/users.json');

// Utility to load users from file
function loadUsers() {
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

// Utility to sanitize user data for public response
function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email, // include only if safe
    profile: user.profile, // bio, avatar, etc.
  };
}

// ----------- PROTECTED ROUTES ----------- //

// POST /api/users/follow — Follow or unfollow a user
router.post('/follow', verifyToken, followUser);

// GET /api/users/me — Get logged-in user's profile
router.get('/me', verifyToken, (req, res) => {
  const users = loadUsers();
  const user = users.find(u => u.id === req.user.id);

  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json(user);
});

// GET /api/users/me/followers — Get logged-in user's followers
router.get('/me/followers', verifyToken, (req, res) => {
  const users = loadUsers();
  const me = users.find(u => u.id === req.user.id);
  if (!me) return res.status(404).json({ error: 'User not found' });

  const followers = users.filter(u => me.followers?.includes(u.id));
  res.json(followers.map(sanitizeUser));
});

// GET /api/users/me/following — Get logged-in user's followings
router.get('/me/following', verifyToken, (req, res) => {
  const users = loadUsers();
  const me = users.find(u => u.id === req.user.id);
  if (!me) return res.status(404).json({ error: 'User not found' });

  const following = users.filter(u => me.following?.includes(u.id));
  res.json(following.map(sanitizeUser));
});

// GET /api/users/search?q=keyword — Search users by name or username
router.get('/search', verifyToken, (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Search query is required' });

  const users = loadUsers();
  const keyword = q.toLowerCase();

  const results = users.filter(user =>
    user.name?.toLowerCase().includes(keyword) ||
    user.username?.toLowerCase().includes(keyword)
  );

  const sanitizedResults = results.map(sanitizeUser);
  res.json(sanitizedResults);
});

// ----------- PUBLIC ROUTES ----------- //

// GET /api/users/:id/followers — Get any user's followers
router.get('/:id/followers', (req, res) => {
  const userId = parseInt(req.params.id);
  const users = loadUsers();
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ error: 'User not found' });

  const followers = users.filter(u => user.followers?.includes(u.id));
  res.json(followers.map(sanitizeUser));
});

// GET /api/users/:id/following — Get any user's following
router.get('/:id/following', (req, res) => {
  const userId = parseInt(req.params.id);
  const users = loadUsers();
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ error: 'User not found' });

  const following = users.filter(u => user.following?.includes(u.id));
  res.json(following.map(sanitizeUser));
});

// GET /api/users/:id — Public profile of a user by ID (no token needed)
router.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const users = loadUsers();
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json(sanitizeUser(user));
});

module.exports = router;
