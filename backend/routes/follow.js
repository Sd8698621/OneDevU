const express = require('express');
const fs = require('fs');
const path = require('path');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();
const usersFile = path.join(__dirname, '../database/users.json');

// --- Utility functions ---
function loadUsers() {
  try {
    const data = fs.readFileSync(usersFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load users.json:', err);
    return [];
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Failed to save users.json:', err);
  }
}

// --- POST /api/users/follow ---
router.post('/', authenticateToken, (req, res) => {
  const followerId = req.user.id;  // from token
  const { followeeId } = req.body;

  if (!followeeId) {
    return res.status(400).json({ error: 'followeeId is required in body.' });
  }

  const users = loadUsers();

  const follower = users.find(u => u.id === followerId);
  const followee = users.find(u => u.id === followeeId);

  if (!follower || !followee) {
    return res.status(404).json({ error: 'User not found.' });
  }

  // Ensure arrays exist
  follower.following = follower.following || [];
  followee.followers = followee.followers || [];

  const isAlreadyFollowing = follower.following.includes(followeeId);

  if (isAlreadyFollowing) {
    // Unfollow
    follower.following = follower.following.filter(id => id !== followeeId);
    followee.followers = followee.followers.filter(id => id !== followerId);
    saveUsers(users);
    return res.json({ message: 'Unfollowed successfully.' });
  } else {
    // Follow
    follower.following.push(followeeId);
    followee.followers.push(followerId);
    saveUsers(users);
    return res.json({ message: 'Followed successfully.' });
  }
});

module.exports = router;
