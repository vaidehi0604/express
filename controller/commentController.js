const Comment = require("../models/comment");
const Post = require("../models/post");

/**
 * @name createComment
 * @file commentController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description create comments API
 * @author vaidehi
 */

const createComment = async (req, res) => {
  try {
    //get value from body
    const { comment, post_id } = req.body;
    const id = req.me.id;

    //check condition if all field are not provided
    if (!comment || !post_id) {
      // Send an error response with status code 400 and a JSON message.
      return res.status(400).json({ error: "All Fields are mandatory" });
    }

    const createComment = await Comment.create({
      comment,
      user_id: id,
      post_id,
      createdBy: req.me.id,
    });

    if (createComment) {
      const updatePostCommentId = await Post.updateOne(
        { _id: post_id },
        { $push: { comments_id: createComment._id } }
      );

      if (!updatePostCommentId) {
        res.status(400).json({ message: "Does Not Updated Comment Id!!" });
      }

      res.status(201).json({
        message: "Create Comment Sucessfully!",
        Comment: createComment,
      });
    } else {
      res.status(400).json({ message: "Does Not Create Comment!!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error });
  }
};

/**
 * @name getPostComment
 * @file commentController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description Get comments by post id
 * @author vaidehi
 */

const getPostComment = async (req, res) => {
  try {
    //get post id
    const { post_id } = req.query;

    //find comment by post Id
    const findComments = await Comment.find({ post_id: post_id })
      .populate("likes")
      .populate("reply_id");

    //if comment not found by post id then throw error message
    if (!findComments) {
      return res
        .status(404)
        .json({ message: "Not Found Comment For this Post Id!!" });
    }

    //return success response
    return res.status(200).json({ message: findComments });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * @name deleteComment
 * @file commentController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description create comments API
 * @author vaidehi
 */
const deleteComment = async (req, res) => {
  try {
    const { id } = req.query;

    const user_id = req.me.id;

    console.log(user_id, "id");

    const findComment = await Comment.findOne({ _id: id });

    const findPost = await Post.findOne({ _id: findComment.post_id });

    if (!findComment || !findPost) {
      return res
        .status(404)
        .json({ message: "post and coment data not found" });
    }

    if (findPost.user_id.equals(user_id)) {
      const deleteComment = await Comment.findByIdAndRemove({ _id: id });

      if (!deleteComment) {
        return res.status(400).json("Comment not deleted!!");
      }

      const removePostCommentId = await Post.updateOne(
        { _id: findPost._id },
        { $pull: { comments_id: id } }
      );

      if (!removePostCommentId) {
        return res.status(400).json("Post Comment Id not removed!!");
      }

      return res
        .status(200)
        .json({ message: "Comment deleted successfully!!!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createComment,
  deleteComment,
  getPostComment,
};
