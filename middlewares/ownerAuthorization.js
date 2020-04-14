const User = require("../Models/user");
const CustomError = require("../helpers/customErrors");
module.exports = async (req, res, next) => {
  const {
    params: { id: userId },
  } = req.body;
  if (User.id.equals(userId)) {
    next();
  } else {
    throw CustomError("Not authorized", 404);
  }
};
