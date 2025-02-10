const Post = require("../models/Post");

// ✅ Create Post
exports.createPost = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = '';
    
    // Validate required fields
    if (!title || !content || title.trim() === '' || content.trim() === '') {
      return res.status(400).json({ 
        message: "Title and content are required" 
      });
    }

    // Handle image upload
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      console.log('Image uploaded:', imageUrl); // Debug log
    } else if (req.body.image) {
      imageUrl = req.body.image; // Keep supporting image URLs
    }

    const post = new Post({ 
      user: req.user.id, 
      title: title.trim(),
      content: content.trim(), 
      image: imageUrl
    });

    await post.save();

    // Return post with success message
    res.status(201).json({
      message: "Post created successfully",
      post: {
        id: post._id,
        title: post.title,
        content: post.content,
        image: post.image,
        user: post.user,
        createdAt: post.createdAt
      }
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// ✅ Get All Posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name profilePic").sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get Single Post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user", "name profilePic");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update Post
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    post.content = req.body.content || post.content;
    post.image = req.body.image || post.image;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Delete Post
exports.deletePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Like Post
exports.likePost = async (req, res) => {
  try {
    // Debug authentication
    console.log('Auth Debug:', {
      hasUser: !!req.user,
      userId: req.user ? req.user.id : 'No user ID',
      headers: req.headers
    });

    // Validate user authentication
    if (!req.user || !req.user.id) {
      console.log('Authentication failed - no user data');
      return res.status(401).json({ message: "Authentication required" });
    }

    // Validate post ID
    if (!req.params.id) {
      console.log('No post ID provided');
      return res.status(400).json({ message: "Post ID is required" });
    }

    console.log('Finding post with ID:', req.params.id);
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      console.log('Post not found with ID:', req.params.id);
      return res.status(404).json({ message: "Post not found" });
    }

    console.log('Post found:', {
      postId: post._id,
      currentLikes: post.likes,
      userId: req.user.id
    });
    
    // Check if post is already liked by comparing string versions of ObjectIds
    const isAlreadyLiked = post.likes.some(like => like.toString() === req.user.id.toString());
    
    console.log('Like check:', {
      isAlreadyLiked,
      userIdToCheck: req.user.id.toString(),
      existingLikes: post.likes.map(like => like.toString())
    });

    if (isAlreadyLiked) {
      return res.status(400).json({ message: "Post already liked" });
    }

    // Add user to likes array
    post.likes.push(req.user.id);
    await post.save();

    // Populate user details in the response
    const updatedPost = await Post.findById(post._id)
      .populate("likes", "name")
      .populate("user", "name profilePic");

    res.json({ 
      message: "Post liked successfully", 
      likes: updatedPost.likes.length,
      post: updatedPost
    });
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({ 
      message: "Server Error",
      error: error.message 
    });
  }
};

// ✅ Unlike Post
exports.unlikePost = async (req, res) => {
  try {
    console.log('Unlike request for post:', req.params.id);
    console.log('User ID:', req.user.id);

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log('Current likes:', post.likes);

    // Check if post is not liked by comparing string versions of ObjectIds
    const isLiked = post.likes.some(like => like.toString() === req.user.id.toString());
    if (!isLiked) {
      return res.status(400).json({ message: "Post not liked yet" });
    }

    // Remove user from likes array
    post.likes = post.likes.filter(like => like.toString() !== req.user.id.toString());
    await post.save();

    // Populate user details in the response
    const updatedPost = await Post.findById(post._id).populate("likes", "name");

    res.json({ 
      message: "Post unliked successfully", 
      likes: updatedPost.likes.length,
      post: updatedPost
    });
  } catch (error) {
    console.error("Unlike post error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
