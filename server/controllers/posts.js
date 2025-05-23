import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { userId, legalDomain, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      userType: user.userType,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      legalDomain,
      userPicturePath: user.picturePath,
      picturePath,
      interests: [],
      comments: [],
    });

    await newPost.save();
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const postInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.body;
    const post = await Post.findById(id);
    post.interests.push({ user: user });

    const updatePost = await Post.findByIdAndUpdate(
      id,
      { interests: post.interests },
      { new: true }
    );

    res.status(200).json(updatePost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const postComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, comment } = req.body;
    const post = await Post.findById(id);
    post.comments.push({ user: user, comment: comment });

    const updatePost = await Post.findByIdAndUpdate(
      id,
      { comments: post.comments },
      { new: true }
    );

    res.status(200).json(updatePost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userType, description, legalDomain, picturePath } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId !== userId && userType !== "admin") {
      return res.status(403).json({ message: "Unauthorized to update post" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { description, legalDomain, picturePath },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userType } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId !== userId && userType !== "admin") {
      return res.status(403).json({ message: "Unauthorized to delete post" });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
