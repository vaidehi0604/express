const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

/**
 * @name register
 * @file authController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description User Register API
 * @author vaidehi
 */
const register = async (req, res) => {
  try {
    //get value from body
    const { name, userName, email, password, mobileNo, address, profilePic } =
      req.body;

      console.log(req.body);

    //check condition if all field are not provided
    if (
      !name ||
      !userName ||
      !email ||
      !password ||
      !mobileNo ||
      !address 
      
    ) {
      // Send an error response with status code 400 and a JSON message.
      return res.status(400).json({ error: "All Fields are mandatory" });
    }

    /* The code is checking if an user with the provided email already exists in the database. */
    const isExists = await User.findOne({ email });

    if (isExists) {
      return res.status(400).json({ error: "Email Already Exists!!!" });
    }

    //Hash password coverter

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      userName,
      email,
      password: hashPassword,
      mobileNo,
      address,
      profilePic,
      isActive: true,
      isDeleted: false,
    });

    if (user) {
      res
        .status(201)
        .json({ message: "User Register Successfully!!", User: user });
    } else {
      res.status(400).json({ message: "User Not Register!!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error });
  }
};

/**
 * @name login
 * @file authController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description User Login API
 * @author vaidehi
 */

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // Send an error response with status code 400 and a JSON message.
      return res
        .status(400)
        .json({ error: "Please Enter Your Email and Password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const checkPassword = await bcrypt.compareSync(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    if (user && checkPassword) {
      const accessToken = jwt.sign(
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1d",
        }
      );

      // Update the user with the access token and lastLoginAt
      const updateAdmin = await User.findByIdAndUpdate(user._id, {
        token: accessToken,
        lastLoginAt: Math.floor(Date.now() / 1000),
      });

      if (!updateAdmin) {
        return res.status(500).json({ message: "Failed to update user" });
      }

      res.status(200).json({ accessToken });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error!" });
  }
};

/**
 * @name forgotPassword
 * @file user.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description forgot password api to send mail and send OTP
 * @author vaidehi
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(404).json({ error: "Email not found!!" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    // console.log(otp);

    const template = path.join(__dirname, "../views/email.ejs");

    const emailFile = await ejs.renderFile(template, { otp: otp });

    const findAdmin = await User.findOne({ email });
    if (!findAdmin) {
      return res.status(404).json({ error: "User not found!!" });
    }

    // Calculate OTP expiry time (e.g., 5 minutes from now)
    const otpExpiry = new Date();

    // Adjust to your desired expiry time
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 1);

    // Update the user's OTP and expiry
    await User.updateOne({ email }, { otp, otpExpiry });

    // Use a setTimeout to check OTP expiry after one minute
    setTimeout(async () => {
      const currentTime = new Date();
      if (otpExpiry <= currentTime) {
        // The OTP has expired
        await User.updateOne({ email }, { otp: "" });
        // return res.status(404).json({ error: "OTP Expired!!!!" });
      }
    }, 1 * 60 * 1000);

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "3379c75fe59e63",
        pass: "f9162afb716029",
      },
    });

    let message = {
      from: "hello@gmail.com",
      to: email,
      subject: "Hello, World!",
      html: emailFile,
    };

    // Send the email
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Internal server error" });
      } else {
        return res.status(201).json({
          message: "You should receive an email",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * @name checkOtp
 * @file user.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description forgot password api to send mail and send OTP
 * @author vaidehi
 */

const checkOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email and OTP are required Field" });
    }

    const findAdmin = await User.findOne({ email });

    if (!findAdmin) {
      return res.status(404).json({ message: "User not found!!" });
    }

    if (findAdmin.otp != otp) {
      return res.status(404).json({ message: "Invalid OTP!!" });
    }

    return res.status(200).json({ message: "Successfully Check OTP!!" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @name checkOtp
 * @file user.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description forgot password api to send mail and send OTP
 * @author vaidehi
 */

const resetPassword = async (req, res) => {
  try {
    const { otp, email, newpassword } = req.body;

    const findAdmin = await User.findOne({ email });

    if (findAdmin.otp === otp) {
      const hashPassword = bcrypt.hashSync(newpassword, 10);

      await User.updateOne({ email }, { password: hashPassword });

      return res.status(200).json({ message: "Successfully Reset Password" });
    }else{
      return res.status(400).json({ message: "OTP not match!!" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
};

/**
 * @name logout
 * @file user.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description logout current user
 * @author vaidehi
 */

const logout = async (req, res) => {
  try {
    //get id from current user id
    const id = req.me.id;

    //if id not found
    if (!id) {
      return res.status(400).json({ message: "Id Not Found!!" });
    }

    //check user exists or not
    const findAdmin = await User.findById(id);

    //if user not found then throw error
    if (!findAdmin) {
      return res.status(400).json({ message: "User Not Found!!" });
    }

    //update a token as a null
    const updateAdmin = await User.updateOne(
      { _id: id },
      { $set: { token: null } }
    );

    //if token not updated then failed logout
    if (!updateAdmin) {
      return res.status(200).json({ message: "Failed to Logout!!" });
    }

    return res.status(200).json({ message: "Logout Successfully!!" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  checkOtp,
  resetPassword,
  logout,
};
