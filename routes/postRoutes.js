const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middlewares/authMiddleware");
const upload = require("../config/multer");

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");

// Create new post with file upload
router.post("/", authMiddleware, upload.single('image'),  createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", authMiddleware, upload.single('image'), updatePost);
router.delete("/:id", authMiddleware, deletePost);



module.exports = router;
