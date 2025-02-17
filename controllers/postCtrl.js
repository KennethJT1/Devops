const Post = require("../models/postModel");

exports.createPost = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required." });
    }

    const post = await Post.create({ title, body });
    return res
      .status(201)
      .json({ message: "Post created successfully.",status: "success", post });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ status: "success", counts: posts.length, data: posts });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed",message: "Server error.", error: error.message });
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ status: "failed",message: "Post not found." });

    return res.status(200).json({ post });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { title, body } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, body },
      { new: true }
    );

    if (!post) return res.status(404).json({ message: "Post not found." });

    return res
      .status(200)
      .json({ message: "Post updated successfully.", post });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    return res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};
