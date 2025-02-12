
const User = require("../models/User");
const Post = require("../models/Post")



exports.completeProfile = async (req, res) => {
    try {
      const { userId, bio } = req.body;
      const profilePic = req.file ? req.file.path : ""; // Multer se uploaded image ka path
  
      // Database me profile pic aur bio update karna
      const updatedUser = await User.findByIdAndUpdate(userId, { profilePic, bio }, { new: true });
  
      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      res.status(500).json({ error: "Profile update failed" });
    }
  };
  




exports.profileController =  async (req, res) => {
    try {
        // Find the user by ID and exclude the password field
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find posts by the user and populate the postedBy field
        const posts = await Post.find({ postedBy: req.params.id })
            .populate("postedBy", "_id");

        res.status(200).json({ user, posts });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

