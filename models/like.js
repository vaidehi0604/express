const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { TYPES } = require("../constants");

const like = mongoose.Schema(
  {
    like: {
      type: Boolean,
      default: false,
    },

    type: {
      type: String, // Note: "string" should be "String"
      enum: Object.values(TYPES), // Use the values of the TYPES object
    },

    user_id: { type: Schema.Types.ObjectId, ref: "User" },

    post_id: { type: Schema.Types.ObjectId, ref: "Post" },

    comment_id: { type: Schema.Types.ObjectId, ref: "Comment" },

    reply_id: { type: Schema.Types.ObjectId, ref: "Reply" },
    
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

module.exports = mongoose.model("Like", like);
