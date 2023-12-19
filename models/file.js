const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const file = mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, "please enter the file name"],
    },

    url: {
      type: String,
      required: [true, "please enter the url"],
    },
    mimetype: {
      type: String,
      required: [true, "please enter the mimetype"],
    },

    size: {
      type: String,
      required: [true, "please enter the mimetype"],
    },
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

module.exports = mongoose.model("File", file);
