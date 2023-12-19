const express = require("express");
const path = require("path");
const cors = require("cors");
const corsOptions = require("../express/cors");
const errorHandler = require("../express/middlewares/errorHandler");

const dotenv = require("dotenv");
const { user } = require("../express/routes/users");
const { authRouter } = require("../express/routes/authRoutes");
const { userRoutes } = require("../express/routes/userRoutes");
const { likeRoutes } = require("../express/routes/likeRoutes");
const { postRoutes } = require("../express/routes/postRoutes");
const { commentRoutes } = require("../express/routes/commentRoutes");
const { replyRoutes } = require("../express/routes/replyRoutes");

dotenv.config();
const app = express();

const connectDB = require("./database/connection");

connectDB();

app.use(cors(corsOptions)); // Apply CORS middleware

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(errorHandler);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Define a route to render the EJS template.
app.get("/", (req, res) => {
  res.render("email"); // 'email' refers to the 'email.ejs' file in the 'views' directory.
});

app.use("/api/users", user);
app.use("/admin", authRouter);
app.use("/user", userRoutes);
app.use("/like", likeRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/reply", replyRoutes);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//used in frontend
