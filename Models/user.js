const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/user", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const util = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sgin = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);

const saltRounds = 7;
const jwtSecret = process.env.JWT_SECRET;
const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      minlength: 3,
      maxlength: 15,
    },
    age: {
      type: Number,
      required: false,
      minlength: 3,
    },
  },
  {}
);
schema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "userId",
});
schema.pre("save", async function () {
  const userInstance = this;
  if (this.isModified("password")) {
    userInstance.password = await bcrypt.hash(
      userInstance.password,
      saltRounds
    );
  }
});

schema.methods.comparePassword = function (plainPassword) {
  const userInstance = this;
  return bcrypt.compare(plainPassword, userInstance.password);
};
schema.methods.userToken = function (err, token) {
  const userInstance = this;
  return sgin({ userId: userInstance.id }, jwtSecret);
};

schema.statics.verifyToken = async function (token) {
  const user = this;
  const payload = await verify(token, jwtSecret);
  const currentUser = await user.findById(payload.userId);
  if (!currentUser) throw new Error("User not found");
  return currentUser;
};
const User = mongoose.model("user", schema);
module.exports = User;
// const kitty = new user({ name: "Zildjian" });
// kitty.save().then(() => console.log("meow"));
