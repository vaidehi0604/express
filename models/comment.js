const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const comment = mongoose.Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    post_id: { type: Schema.Types.ObjectId, ref: "Post" },
    reply_id: { type: Schema.Types.ObjectId, ref: "Reply" },
    comment: {
      type: String,
    },

    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],

    likes_count: { type: Number, default: 0 },
    createdBy: {
      type: "string",
    },

    updatedBy: {
      type: "string",
    },

    isDeleted: {
      type: "boolean",
      defaultsTo: false,
    },

    isActive: {
      type: "boolean",
      defaultsTo: true,
    },

    deletedBy: {
      type: "string",
      allowNull: true,
    },

    deletedAt: {
      type: "number",
      allowNull: true,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields.
  }
);

module.exports = mongoose.model("Comment", comment);
