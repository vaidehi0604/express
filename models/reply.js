const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reply = mongoose.Schema(
  {
    reply: {
      type: String,
      required: [true, "please enter the reply on comment"],
    },
    likeId:{type: Schema.Types.ObjectId, ref: "Like" },
    
    commentId: { type: Schema.Types.ObjectId, ref: "Comment" },

    userId: { type: Schema.Types.ObjectId, ref: "User" },

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

module.exports = mongoose.model("Reply", reply);
