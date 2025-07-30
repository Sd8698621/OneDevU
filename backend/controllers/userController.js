const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../database/users.json');

function loadUsers() {
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Controller: follow/unfollow user
function followUser(req, res) {
  const followerId = req.user.id;
  const { followeeId } = req.body;

  if (!followeeId) return res.status(400).json({ error: 'followeeId is required' });

  const users = loadUsers();
  const follower = users.find(u => u.id === followerId);
  const followee = users.find(u => u.id === followeeId);

  if (!follower || !followee) return res.status(404).json({ error: 'User not found' });

  const isFollowing = follower.following.includes(followeeId);

  if (isFollowing) {
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
}

module.exports = {
  followUser,
};
