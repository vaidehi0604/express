

// const cors = require("cors");

// Define the frontend URL that is allowed to make requests to your backend
const allowedOrigins = ["http://localhost:3005"]; // Add your frontend URL(s) here

// Create a CORS options object
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the list of allowed origins
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Block the request
    }
  },
};

module.exports=corsOptions;
// Enable CORS with the custom options

// app.use(cors());