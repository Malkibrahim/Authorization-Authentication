var express = require("express");
var router = express.Router();
const User = require("../Models/user");
const Post = require("../Models/post");
const mongoose = require("mongoose");
const authenticationMiddlleware = require("../middlewares/authentication");
const ownerAuthorizationPosts = require("../middlewares/ownerAuthorizationPosts");
const ownerAuthorization = require("../middlewares/ownerAuthorization");

const { check, validationResult } = require("express-validator");
const validationChecks = require("../middlewares/validation");
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });
// define the home page route
router.get("/", async (req, res, next) => {
  const data = await User.find();
  res.send(data);
});
router.get("/posts", async (req, res, next) => {
  const data = await Post.find();
  res.send(data);
});
router.post(
  "/register",
  validationChecks(
    check("username").isEmail(),

    check("password").isLength({ min: 5 })
  ),
  async (req, res, next) => {
    const { username, password, firstName, age } = req.body;
    const user = new User({ username, password, firstName, age });
    await user.save();
    res.json({
      message: "user was registered successfully",
      user,
    });
  }
);
router.post(
  "/post",
  validationChecks(check("title").isLength({ min: 5 })),
  async (req, res, next) => {
    const { userId, title, body, tags } = req.body;
    const post = new Post({
      userId: mongoose.Types.ObjectId(),
      title,
      body,
      tags,
    });
    await post.save();
    res.json(post);
  }
);
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username })
    .limit(10)
    .populate("posts")
    .exec();
  if (!user) throw new Error("Your data is Wrong");
  const isMatch = user.comparePassword(password);
  if (!isMatch) throw new Error("Your data is Wrong");

  const token = await user.userToken();
  res.json({
    message: "Logged in successfully",
    username: username,
    user,
    token,
  });
});
router.get("/profile", authenticationMiddlleware, async (req, res, next) => {
  res.send(req.user);
});
router.delete(
  "/:id",
  authenticationMiddlleware,
  ownerAuthorization,
  async (req, res, next) => {
    const id = req.params;

    const user = await User.findByIdAndRemove({ _id: id });

    res.json({
      message: "user deleted successfully",
    });
  }
);
router.patch(
  "/:id",
  authenticationMiddlleware,
  ownerAuthorization,
  async (req, res, next) => {
    const id = req.params;
    const { username, password, firstName, age } = req.body;

    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        username,
        password,
        firstName,
        age,
      }
    );

    res.json({
      message: "user Edited successfully",
    });
  }
);
router.patch(
  "/post/:id",
  authenticationMiddlleware,
  ownerAuthorizationPosts,
  async (req, res, next) => {
    const id = req.params;
    const { title, body } = req.body;
    const post = await Post.findByIdAndUpdate(
      { _id: id },
      {
        body,
        title,
      }
    );
    res.json({
      message: "Post edited successfully",
    });
  }
);
router.delete(
  "/post/:id",
  authenticationMiddlleware,
  ownerAuthorizationPosts,
  async (req, res, next) => {
    const id = req.params;

    const post = await Post.findByIdAndRemove({ _id: id });

    res.json({
      message: "user deleted successfully",
    });
  }
);
// define the about route
router.get("/about", function (req, res) {
  res.send("About birds");
});

module.exports = router;
