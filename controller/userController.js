const User = require("../models/user");
const File = require("../models/file");
const Post = require("../models/post");

/**
 * @name uploadProfilePic
 * @file admin.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description forgot password api to send mail and send OTP
 * @author vaidehi
 */

const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        errorCode: "ERR400",
        message: "No file uploaded",
      });
    }

    // Create a new file document in the database
    const newFiles = await File.create({
      filename: req.file.originalname,
      url: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.body.uploadedBy,
    });

    // console.log("newFiles",newFiles);

    return res.status(200).json({
      status: 200,
      errorCode: "SUC000",
      message: "File uploaded successfully",
      data: newFiles,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      errorCode: "ERR500",
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * @name multipleUpload
 * @file admin.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description upload multiple image
 * @author vaidehi
 */

const multipleUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 400,
        errorCode: "ERR400",
        message: "No files uploaded",
      });
    }

    // Create an array to store the new file documents
    const newFiles = await Promise.all(
      req.files.map(async (file) => {
        try {
          const newFile = await File.create({
            filename: file.originalname,
            url: file.path,
            mimetype: file.mimetype,
            size: file.size,
          });
          return newFile;
        } catch (fileCreationError) {
          // Handle the error if file creation fails for any reason
          console.error("Error creating file:", fileCreationError.message);
          return null; // Or handle the error in a way that fits your application
        }
      })
    );

    // Filter out null values (failed file creations)
    const successfulFiles = newFiles.filter((file) => file !== null);

    if (successfulFiles.length === 0) {
      // If all file creations failed, return an error response
      return res.status(500).json({
        status: 500,
        errorCode: "ERR500",
        message: "Failed to create any files",
      });
    }

    // console.log("Successful files:", successfulFiles);

    return res.status(200).json({
      status: 200,
      errorCode: "SUC000",
      message: "Files uploaded successfully",
      data: successfulFiles,
    });
  } catch (error) {
    console.error("Error in multipleUpload:", error.message);
    return res.status(500).json({
      status: 500,
      errorCode: "ERR500",
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * @name getProfile
 * @file admin.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description Get User Profile
 * @author vaidehi
 */
const getProfile = async (req, res) => {
  try {
    const id = req.me.id;

    const adminProfile = await User.findById(id)
      .populate({ path: "postId", model: Post })
      .exec();

    res.status(200).json({
      message: "User Get Profile Successfully!!",
      profile: {
        id: adminProfile._id,
        name: adminProfile.name,
        email: adminProfile.email,
        mobileNo: adminProfile.mobileNo,
        postCount: adminProfile.postCount,
        postId: adminProfile.postId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error!" });
  }
};

/**
 * @name getProfile
 * @file admin.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description Get User Profile
 * @author vaidehi
 */
const getAllUser = async (req, res) => {
  try {
    const { user } = req.query;

    const query = user
      ? {
          $or: [
            { userName: { $regex: new RegExp(user, "i") } },
            { name: { $regex: new RegExp(user, "i") } },
          ],
        }
      : {};

    const allUserProfile = await User.find(query)
      .populate({ path: "postId", model: "Post" })
      .exec();

    const responseData = allUserProfile.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      mobileNo: user.mobileNo,
      postCount: user.postCount,
      postId: user.postId,
    }));

    res.status(200).json({
      message: "User Get Profile Successfully!!",
      profile: responseData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error!" });
  }
};

module.exports = {
  getProfile,
  uploadProfilePic,
  multipleUpload,
  getAllUser,
};
