const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentLike = mongoose.Schema(
  {
    like: {
      type: Boolean,
      default: false,
    },

    user_id: { type: Schema.Types.ObjectId, ref: "Admin" },
    
    comment_id: { type: Schema.Types.ObjectId, ref: "Comment" },
    post_id: { type: Schema.Types.ObjectId, ref: "Post" },

  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields.
  }
);

module.exports = mongoose.model("CommentLike", commentLike);
