const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const post = mongoose.Schema(
  {
    caption: { type: String },

    user_id: { type: Schema.Types.ObjectId, ref: "User" },

    image_id: { type: Schema.Types.ObjectId, ref: "File" },

    like_id: [{ type: Schema.Types.ObjectId, ref: "Like" }],

    comments_id: [{ type: Schema.Types.ObjectId, ref: "Comment" }],

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

module.exports = mongoose.model("Post", post);
