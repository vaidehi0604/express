// const CommentLike = require("../models/commentLike");
// const Comment = require("../models/comment");

// /**
//  * @name likeComment
//  * @file likeController.js
//  * @param {Request} req
//  * @param {Response} res
//  * @throwsF
//  * @description Like a perticuler post
//  * @author vaidehi
//  */

// const likeComment = async (req, res) => {
//   try {
//     // get data from body
//     const { like, comment_id } = req.body;

//     //get current user id
//     const user_id = req.me.id;

//     // find if the comment like already exists
//     const commentLikeExists = await CommentLike.findOne({
//       comment_id: comment_id,
//       user_id: user_id,
//     });

//     if (commentLikeExists) {
//       // if the comment is already liked
//       if (commentLikeExists.like === true) {
//         // set the like to false
//         const isLike = await CommentLike.findOneAndUpdate(
//           { _id: commentLikeExists._id },
//           { $set: { like: false } },
//           { new: true }
//         );

//         if (isLike) {
//           // update the comment to remove the like
//           const updateCommentLike = await Comment.updateOne(
//             { _id: comment_id },
//             {
//               $pull: { likes: commentLikeExists._id },
//               $inc: { likes_count: -1 },
//             }
//           );

//           if (!updateCommentLike) {
//             return res
//               .status(400)
//               .json({ message: "Failed to update comment!" });
//           }
//           return res.status(200).json({ message: "User disliked a comment!" });
//         } else {
//           return res
//             .status(200)
//             .json({ message: "Failed to dislike a comment!" });
//         }
//       } else if (commentLikeExists.like === false) {
//         // if the comment is disliked, set the like to true
//         const isLike = await CommentLike.findOneAndUpdate(
//           { _id: commentLikeExists._id },
//           { $set: { like: true } },
//           { new: true }
//         );

//         if (isLike) {
//           // update the comment to add the like
//           const updateCommentLike = await Comment.updateOne(
//             { _id: comment_id },
//             {
//               $push: { likes: commentLikeExists._id },
//               $inc: { likes_count: 1 },
//             }
//           );

//           if (!updateCommentLike) {
//             return res
//               .status(400)
//               .json({ message: "Failed to update comment!" });
//           }
//           return res.status(200).json({ message: "User liked a comment!" });
//         } else {
//           return res.status(200).json({ message: "Failed to like a comment!" });
//         }
//       } else {
//         return res.status(400).json({
//           message: "Failed to like or dislike the comment!",
//         });
//       }
//     } else {
//       // create a new comment like
//       const createCommentLike = await CommentLike.create({
//         like,
//         user_id,
//         comment_id,
//       });

//       // if the like is not created
//       if (!createCommentLike) {
//         return res
//           .status(400)
//           .json({ message: "Comment Like is not created!" });
//       }

//       // update the comment to add the like
//       const updateCommentLike = await Comment.updateOne(
//         { _id: comment_id },
//         {
//           $push: { likes: createCommentLike._id },
//           $inc: { likes_count: 1 },
//         }
//       );

//       if (!updateCommentLike) {
//         return res.status(400).json({ message: "Failed to update comment!" });
//       }

//       return res.status(200).json({ message: "Comment Like is created!" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Server Error", error: error });
//   }
// };

// module.exports = {
//   likeComment,
// };
