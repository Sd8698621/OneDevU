const express = require('express');
const router = express.Router();
const { followUser } = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../database/users.json');

// Load all users
function loadUsers() {
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

// Save updated users
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Sanitize user object before sending to frontend
function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    profile: user.profile,
  };
}

// ----------- PROTECTED ROUTES ----------- //

// POST /api/users/follow — Follow/unfollow a user
router.post('/follow', verifyToken, (req, res) => {
  const { targetId } = req.body;
  const currentUserId = req.user.id;

  if (!targetId || currentUserId === targetId) {
    return res.status(400).json({ error: 'Invalid follow request' });
  }

  const users = loadUsers();
  const me = users.find(u => u.id === currentUserId);
  const target = users.find(u => u.id === targetId);

  if (!me || !target) return res.status(404).json({ error: 'User not found' });

  me.following = me.following || [];
  target.followers = target.followers || [];

  const isFollowing = me.following.includes(targetId);

  if (isFollowing) {
    // Unfollow
    me.following = me.following.filter(id => id !== targetId);
    target.followers = target.followers.filter(id => id !== currentUserId);
  } else {
    // Follow
    me.following.push(targetId);
    target.followers.push(currentUserId);
  }

  saveUsers(users);

  return res.json({ success: true, isFollowing: !isFollowing });
});

// GET /api/users/me
router.get('/me', verifyToken, (req, res) => {
  const users = loadUsers();
  const user = users.find(u => u.id === req.user.id);

  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json(user);
});

// GET /api/users/me/followers
router.get('/me/followers', verifyToken, (req, res) => {
  const users = loadUsers();
  const me = users.find(u => u.id === req.user.id);
  if (!me) return res.status(404).json({ error: 'User not found' });

  const followers = users.filter(u => me.followers?.includes(u.id));
  res.json(followers.map(sanitizeUser));
});

// GET /api/users/me/following
router.get('/me/following', verifyToken, (req, res) => {
  const users = loadUsers();
  const me = users.find(u => u.id === req.user.id);
  if (!me) return res.status(404).json({ error: 'User not found' });

  const following = users.filter(u => me.following?.includes(u.id));
  res.json(following.map(sanitizeUser));
});

// GET /api/users/search?q=keyword
router.get('/search', verifyToken, (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Search query is required' });

  const users = loadUsers();
  const me = users.find(u => u.id === req.user.id);
  if (!me) return res.status(403).json({ error: 'Unauthorized' });

  const keyword = q.toLowerCase();

  const results = users
    .filter(user =>
      user.name?.toLowerCase().includes(keyword) ||
      user.username?.toLowerCase().includes(keyword)
    )
    .filter(user => user.id !== me.id) // don't show self
    .map(user => ({
      ...sanitizeUser(user),
      isFollowing: me.following?.includes(user.id) || false,
    }));

  res.json(results);
});

// ----------- PUBLIC ROUTES ----------- //

// GET /api/users/:id/followers
router.get('/:id/followers', (req, res) => {
  const userId = parseInt(req.params.id);
  const users = loadUsers();
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ error: 'User not found' });

  const followers = users.filter(u => user.followers?.includes(u.id));
  res.json(followers.map(sanitizeUser));
});

// GET /api/users/:id/following
router.get('/:id/following', (req, res) => {
  const userId = parseInt(req.params.id);
  const users = loadUsers();
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ error: 'User not found' });

  const following = users.filter(u => user.following?.includes(u.id));
  res.json(following.map(sanitizeUser));
});

// PLACE THIS ABOVE /:id !!!
router.get('/is-following/:id', verifyToken, (req, res) => {
  const targetId = parseInt(req.params.id);
  const users = loadUsers();
  const me = users.find(u => u.id === req.user.id);

  if (!me) {
    return res.status(404).json({ error: 'User not found' });
  }

  const isFollowing = me.following && me.following.includes(targetId);
  res.json({ isFollowing });
});

// GET /api/users/:id — public profile
router.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const users = loadUsers();
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json(sanitizeUser(user));
});


module.exports = router;
