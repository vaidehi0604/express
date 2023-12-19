const Like = require("../models/like");
const Post = require("../models/post");
const { TYPES } = require("../constants");
const Comment = require("../models/comment");
const Reply = require("../models/reply");
/**
 * @name likePost
 * @file likeController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description Like a perticuler post
 * @author vaidehi
 */
const likePost = async (req, res) => {
  try {
    //get like from body
    const { like, postId } = req.body;

    const { id } = req.me;

    //check if like already exists for the current user and post
    const likeExists = await Like.findOne({
      post_id: postId,
      user_id: id,
      type: TYPES.POST_LIKE,
    });

    //if like already exists
    if (likeExists) {
      //if like is true, update it to false
      if (likeExists.like === true) {
        //update like to false
        const isLike = await Like.findOneAndUpdate(
          { _id: likeExists._id },
          { $set: { like: false } },
          { new: true } // Return the updated object in response
        );

        if (isLike) {
          //if user liked the post then update a like count in post model
          const updatePostLikeId = await Post.updateOne(
            { _id: postId },
            { $pull: { like_id: likeExists._id }, $inc: { likes_count: -1 } }
          );

          if (!updatePostLikeId) {
            return res.status(400).json({ message: "Failed to update post!" });
          }

          return res.status(200).json({ message: "User disliked a post!" });
        } else {
          return res
            .status(400)
            .json({ message: "Failed to update like status!" });
        }
      } else if (likeExists.like === false) {
        //if like is false, update it to true
        const isLike = await Like.findOneAndUpdate(
          { _id: likeExists._id },
          { $set: { like: true } },
          { new: true } // Return the modified document
        );

        if (isLike) {
          const updatePostLikeId = await Post.updateOne(
            { _id: postId },
            { $push: { like_id: likeExists._id }, $inc: { likes_count: 1 } }
          );

          if (!updatePostLikeId) {
            return res.status(400).json({ message: "Failed to update post!" });
          }

          return res.status(200).json({ message: "User liked the post!" });
        } else {
          return res
            .status(400)
            .json({ message: "Failed to update like status!" });
        }
      } else {
        return res
          .status(400)
          .json({ message: "Failed to like or dislike like!" });
      }
    } else {
      //if like does not exist then create
      const createLike = await Like.create({
        like: like,
        user_id: id,
        post_id: postId,
        createdBy: req.me.id,
        type: TYPES.POST_LIKE,
      });

      if (createLike) {
        const updatePostLikeId = await Post.updateOne(
          { _id: postId },
          { $push: { like_id: createLike._id }, $inc: { likes_count: 1 } }
        );

        if (!updatePostLikeId) {
          return res.status(400).json({ message: "Failed to update post!" });
        }

        return res.status(200).json({
          message: "User Liked Successfully!",
          Like: createLike,
        });
      } else {
        return res.status(400).json({ message: "Failed to create like!" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", error: error });
  }
};

/**
 * @name likeComment
 * @file likeController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description Like a perticuler comment
 * @author vaidehi
 */

const likeComment = async (req, res) => {
  try {
    // get data from body
    const { like, comment_id } = req.body;

    //get current user id
    const user_id = req.me.id;

    // find if the comment like already exists
    const commentLikeExists = await Like.findOne({
      comment_id: comment_id,
      user_id: user_id,
      type: TYPES.COMMENT_LIKE,
    });

    if (commentLikeExists) {
      // if the comment is already liked
      if (commentLikeExists.like === true) {
        // set the like to false
        const isLike = await Like.findOneAndUpdate(
          { _id: commentLikeExists._id },
          { $set: { like: false } },
          { new: true }
        );

        if (isLike) {
          // update the comment to remove the like
          const updateCommentLike = await Comment.updateOne(
            { _id: comment_id },
            {
              $pull: { likes: commentLikeExists._id },
              $inc: { likes_count: -1 },
            }
          );

          if (!updateCommentLike) {
            return res
              .status(400)
              .json({ message: "Failed to update comment!" });
          }
          return res.status(200).json({ message: "User disliked a comment!" });
        } else {
          return res
            .status(200)
            .json({ message: "Failed to dislike a comment!" });
        }
      } else if (commentLikeExists.like === false) {
        // if the comment is disliked, set the like to true
        const isLike = await Like.findOneAndUpdate(
          { _id: commentLikeExists._id },
          { $set: { like: true } },
          { new: true }
        );

        if (isLike) {
          // update the comment to add the like
          const updateCommentLike = await Comment.updateOne(
            { _id: comment_id },
            {
              $push: { likes: commentLikeExists._id },
              $inc: { likes_count: 1 },
            }
          );

          if (!updateCommentLike) {
            return res
              .status(400)
              .json({ message: "Failed to update comment!" });
          }
          return res.status(200).json({ message: "User liked a comment!" });
        } else {
          return res.status(200).json({ message: "Failed to like a comment!" });
        }
      } else {
        return res.status(400).json({
          message: "Failed to like or dislike the comment!",
        });
      }
    } else {
      // create a new comment like
      const createCommentLike = await Like.create({
        like,
        user_id,
        comment_id,
        type: TYPES.COMMENT_LIKE,
      });

      // if the like is not created
      if (!createCommentLike) {
        return res
          .status(400)
          .json({ message: "Comment Like is not created!" });
      }

      // update the comment to add the like
      const updateCommentLike = await Comment.updateOne(
        { _id: comment_id },
        {
          $push: { likes: createCommentLike._id },
          $inc: { likes_count: 1 },
        }
      );

      if (!updateCommentLike) {
        return res.status(400).json({ message: "Failed to update comment!" });
      }

      return res
        .status(200)
        .json({ message: "Comment Like is created!", createCommentLike });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error: error });
  }
};

/**
 * @name likeReply
 * @file likeController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description Like a perticuler reply
 * @author vaidehi
 */

const likeReply = async (req, res) => {
  try {
    // get data from body
    const { like, replyId } = req.body;

    //get current user id
    const user_id = req.me.id;

    // find if the comment like already exists
    const replyLikeExists = await Like.findOne({
      reply_id: replyId,
      user_id: user_id,
      type: TYPES.REPLY_LIKE,
    });

    if (replyLikeExists) {
      // if the comment is already liked
      if (replyLikeExists.like === true) {
        // set the like to false
        const isLike = await Like.findOneAndUpdate(
          { _id: replyLikeExists._id },
          { $set: { like: false } },
          { new: true }
        );

        if (isLike) {
          // update the comment to remove the like
          const updateCommentLike = await Reply.updateOne(
            { _id: replyId },
            {
              $pull: { likes: replyLikeExists._id },
              $inc: { likes_count: -1 },
            }
          );

          if (!updateCommentLike) {
            return res.status(400).json({ message: "Failed to update reply!" });
          }
          return res.status(200).json({ message: "User disliked a reply!" });
        } else {
          return res
            .status(200)
            .json({ message: "Failed to dislike a reply!" });
        }
      } else if (replyLikeExists.like === false) {
        // if the comment is disliked, set the like to true
        const isLike = await Like.findOneAndUpdate(
          { _id: replyLikeExists._id },
          { $set: { like: true } },
          { new: true }
        );

        if (isLike) {
          // update the comment to add the like
          const updateReplyLike = await Reply.updateOne(
            { _id: replyId },
            {
              $push: { likes: replyLikeExists._id },
              $inc: { likes_count: 1 },
            }
          );

          if (!updateReplyLike) {
            return res.status(400).json({ message: "Failed to update reply!" });
          }
          return res.status(200).json({ message: "User liked a reply!" });
        } else {
          return res.status(200).json({ message: "Failed to like a reply!" });
        }
      } else {
        return res.status(400).json({
          message: "Failed to like or dislike the reply!",
        });
      }
    } else {
      // create a new comment like
      const createReplyLike = await Like.create({
        like,
        user_id,
        reply_id: replyId,
        type: TYPES.REPLY_LIKE,
      });

      // if the like is not created
      if (!createReplyLike) {
        return res.status(400).json({ message: "Reply Like is not created!" });
      }

      // update the comment to add the like
      const updateCommentLike = await Reply.updateOne(
        { _id: replyId },
        {
          $push: { likes: createReplyLike._id },
          $inc: { likes_count: 1 },
        }
      );

      if (!updateCommentLike) {
        return res.status(400).json({ message: "Failed to update reply!" });
      }

      return res
        .status(200)
        .json({ message: "reply Like is created!", createReplyLike });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error: error });
  }
};

module.exports = {
  likePost,
  likeComment,
  likeReply,
};
