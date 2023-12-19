const Post = require("../models/post");
const User = require("../models/user");
/**
 * @name createPost
 * @file postController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description create post API
 * @author vaidehi
 */

const createPost = async (req, res) => {
  try {
    //get value from body
    const { caption, image_id } = req.body;

    //check condition if all field are not provided
    if (!caption || !image_id) {
      // Send an error response with status code 400 and a JSON message.
      return res.status(400).json({ error: "All Fields are mandatory" });
    }

    const createPost = await Post.create({
      caption,
      user_id: req.me.id,
      image_id,
      createdBy: req.me.id,
      isDeleted: false,
    });

    if (createPost) {
      const updateUser = await User.findByIdAndUpdate(
        { _id: req.me.id },
        { $push: { postId: createPost._id }, $inc: { postCount: 1 } }
      );

      if (!updateUser) {
        res.status(400).json({ message: "user not updated!!" });
      }

      res
        .status(201)
        .json({ message: "Create Post Sucessfully!", Post: createPost });
    } else {
      res.status(400).json({ message: "Does Not Create Post!!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error });
  }
};

/**
 * @name getPost
 * @file postController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description get post one details
 * @author vaidehi
 */

const getPost = async (req, res) => {
  try {
    const { postId } = req.body;

    const getPost = await Post.findById({ _id: postId, isDeleted: false })
      .populate("like_id")
      .populate("comments_id")
      .exec();

    if (getPost) {
      res.status(201).json({ message: "Get Post Sucessfully!", Post: getPost });
    } else {
      res.status(400).json({ message: "Doesn't get Post!!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error });
  }
};

/**
 * @name getAllPost
 * @file postController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description get all post details
 * @author vaidehi
 */

const getAllPost = async (req, res) => {
  try {
    const { id } = req.me;

    const getPost = await Post.find({ user_id: id, isDeleted: false })
      .populate("like_id")
      .populate("comments_id")
      .exec();

    if (getPost) {
      res.status(201).json({ message: "Get Post Sucessfully!", Post: getPost });
    } else {
      res.status(400).json({ message: "Doesn't get Post!!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error });
  }
};

/**
 * @name deletePost
 * @file postController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description Delete post by Id
 * @author vaidehi
 */
const deletePost = async (req, res) => {
  try {
    // get current user Id
    const { id } = req.me;

    // get post Id
    const { postId } = req.query;

    // check post exists or not
    const findPost = await Post.findOne({ _id: postId });

    // if post not exists then throw error
    if (!findPost) {
      return res.status(404).json({ message: "Post Doesn't Exist!!" });
    }
    // convert user_id to string
    const postUserId = findPost.user_id.toString("utf8");

    // check if the current user and the post creator are the same
    if (postUserId !== id) {
      return res
        .status(400)
        .json({ message: "This Post is not yours you cannot delete it." });
    }

    // delete post
    const deletedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { isDeleted: true }
    );

    if (deletedPost) {
      const updateUser = await User.findByIdAndUpdate(
        { _id: id },
        { $pull: { postId: postId }, $inc: { postCount: -1 } }
      );

      if (!updateUser) {
        res.status(400).json({ message: "user not updated!!" });
      }
    }

    if (!deletedPost) {
      return res.status(400).json({
        message: "Post not deleted!!",
      });
    }

    return res.status(200).json({
      message: "Post deleted successfully!!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createPost,
  getPost,
  getAllPost,
  deletePost,
};
