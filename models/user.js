const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter name"],
    },
    userName: {
      type: String,
      required: [true, "please enter the user name"],
    },
    email: {
      type: String,
      required: [true, "please enter the user email"],
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      required: [true, "please enter the user password"],
    },
    mobileNo: {
      type: String,
      required: [true, "please enter the user mobileNo"],
    },
    profilePic: { type: Schema.Types.ObjectId, ref: "File" },

    token: { type: "string" },

    lastLoginAt: { type: "string" },

    otp: { type: String },

    otpExpiry: { type: "number" },

    postId: [{ type: Schema.Types.ObjectId, ref: "Post" }],

    postCount:{ type: Number, default: 0 },

    follow: { type: Boolean },

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

module.exports = mongoose.model("User", user);
