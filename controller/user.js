const User = require("../models/user");
//using async handler we dont need to define try catch block
const asyncHandler = require("express-async-handler");

//@desc Get all student
//@rout GET /api/user
//@access public
//@author vaidehi

const getUsers = asyncHandler(async (req, res) => {
  const user = await User.find();
  if (!user) {
    res.status(404).json({ message: "User can not found!!" });
  }
  res.status(200).json({ message: "GET All Users!!", users: user });
});

//@desc Get One user By Id
//@rout GET /api/user/:id
//@access public
//@author vaidehi

const getOneUsers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({ message: "User can not found" });
  }
  res.status(200).json(user);
});

//@desc create user
//@rout POST /api/user
//@access public
//@author vaidehi

const createUsers = asyncHandler(async (req, res) => {
  const { name, email, password, mobileNo, address } = req.body;
  if (!name || !email || !password || !mobileNo || !address) {
    // Send an error response with status code 400 and a JSON message.
    return res.status(400).json({ error: "All Fields are mandatory" });
  }
  const user = await User.create({
    name,
    email,
    password,
    mobileNo,
    address,
  });

  console.log(user);
  // Send a success response with status code 200 and a JSON message.
  return res
    .status(201)
    .json({ message: "Created All Users!!!!!", user: user });
});

//@desc User updated
//@rout POST /api/user/:id
//@access public
//@author vaidehi

const editUsers = async (req, res) => {
  try {
    const id = req.params.id;

    const { name, email, password, mobileNo, address } = req.body;

    const updateData = { name, email, password, mobileNo, address };

    const user = await User.findByIdAndUpdate(id, updateData);

    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "user updated successfully!!" });
  } catch (error) {
    // Handle errors here
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//@desc Delete User
//@rout POST /api/user/:id
//@access public
//@author vaidehi

const deleteUsers = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) {
    return res.status(404).json("User not found");
  }
  res.status(200).json({ message: "User Deleted Successfully!!!!!" });
});

module.exports = { getUsers, createUsers, getOneUsers, editUsers, deleteUsers };
