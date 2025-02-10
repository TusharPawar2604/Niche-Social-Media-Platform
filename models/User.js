const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: "" },
  bio: { type: String, default: "" },
}, { timestamps: true });

// Helper method to check if a user is following another user
UserSchema.methods.isFollowing = function(userId) {
  return this.following.includes(userId);
};

// Helper method to get follower count
UserSchema.virtual('followerCount').get(function() {
  return this.followers.length;
});

// Helper method to get following count
UserSchema.virtual('followingCount').get(function() {
  return this.following.length;
});

module.exports = mongoose.model("User", UserSchema);
