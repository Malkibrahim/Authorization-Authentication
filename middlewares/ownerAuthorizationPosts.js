const post = require("../Models/post");
const CustomError = require("../helpers/customErrors");
module.exports = async (req, res, next) => {
  const {
    params: { id: postId },
    user: { id: userId },
  } = req.body;
  if (post.userId.equals(userId)) {
    next();
  } else {
    throw CustomError("Not authorized", 404);
  }
};
