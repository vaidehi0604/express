const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = async (req, res, next) => {
  let token;

  let authHeader = req.headers.authorization;

  if (authHeader) {
    let bearer = authHeader.startsWith("Bearer");

    if (bearer) {
      token = authHeader.split(" ");

      // Access the actual token using token[1]
      jwt.verify(token[1], process.env.JWT_KEY, async (err, decode) => {
        if (err) {
          console.log("JWT Verification Error:", err);
          res.status(500).json({ message: "User is not verified!!" });
        } else {
          // console.log(decode);
          const adminData = await User.findOne({ email: decode.admin.email });

          if (adminData && adminData.token) {
            // Compare the actual token with the stored token
            if (token[1] === adminData.token) {
              req.me = decode.admin;
              next();
            } else {
              res.status(401).json({ message: "Invalid token" });
            }
          } else {
            res.status(401).json({ message: "Token Expired!!" });
          }
        }
      });
    } else {
      res.status(401).json({ message: "Bearer token not provided" });
    }
  } else {
    res.status(500).json({ message: "Authorization header not provided" });
  }
};

module.exports = verifyToken;
