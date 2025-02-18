const express = require("express");
const router = express.Router();
const PostController = require("../controllers/postCtrl");
const protect = require("../middlewares/authmiddleware");

router.post("/", protect, PostController.createPost);
router.get("/", PostController.getAllPosts);
router.get("/:id", protect, PostController.getPostById);
router.put("/:id", protect, PostController.updatePost);
router.delete("/:id", protect, PostController.deletePost);

module.exports = router;
