const Reply = require("../models/reply");
const Post = require("../models/post");
const Comment = require("../models/comment");

/**
 * @name createReply
 * @file postController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description create post API
 * @author vaidehi
 */

const createReply = async (req, res) => {
  try {
    //get value from body
    const { reply, commentId } = req.body;

    //check condition if all field are not provided
    if (!reply || !commentId) {
      // Send an error response with status code 400 and a JSON message.
      return res.status(400).json({ error: "reply Fields are mandatory!!" });
    }

    const createReply = await Reply.create({
      reply,
      commentId,
      userId: req.me.id,
      createdBy: req.me.id,
    });

    if (createReply) {
      const updateComment = await Comment.findByIdAndUpdate(
        { _id: commentId },
        { $push: { reply_id: createReply.id } }
      );

      if (!updateComment) {
        res.status(400).json({ message: "comment not updated!!" });
      }

      res
        .status(201)
        .json({ message: "Create Reply Sucessfully!", Reply: createReply });
    } else {
      res.status(400).json({ message: "Reply is not created!!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error });
  }
};

/**
 * @name createReply
 * @file postController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description create post API
 * @author vaidehi
 */

const deleteReply = async (req, res) => {
  try {
    // get current user Id
    const { id } = req.me;

    //get value from body
    const { replyId } = req.query;

    //check condition if all field are not provided
    if (!replyId) {
      // Send an error response with status code 400 and a JSON message.
      return res.status(400).json({ error: "reply Fields are mandatory!!" });
    }

    const findReply = await Reply.findOne({ _id: replyId, isDeleted: false });

    if (!findReply) {
      res.status(404).json({ message: "Reply is not Found!!" });
    }

    const findPost = await Post.findOne({
      comments_id: findReply.commentId,
      isDeleted: false,
    });

    const postUserId = findPost.user_id.toString("utf8");

    // check if the current user and the post creator are the same
    if (postUserId !== id) {
      return res.status(400).json({
        message: "This Reply is not in your post so  you cannot delete it.",
      });
    }

    // delete post
    const deleteReply = await Reply.findOneAndUpdate(
      { _id: replyId },
      { isDeleted: true }
    );
    console.log(deleteReply);

    if (deleteReply) {
      const updateComment = await Comment.findByIdAndUpdate(
        { _id: findReply.commentId },
        { $push: { reply_id: createReply.id } }
      );
      if (!updateComment) {
        res.status(400).json({ message: "user not updated!!" });
      }

      res
        .status(201)
        .json({ message: "Reply Deleted Sucessfully!", Reply: createReply });
    } else {
      res.status(400).json({ message: "Reply not Deleted!!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error });
  }
};

module.exports = { createReply, deleteReply };
