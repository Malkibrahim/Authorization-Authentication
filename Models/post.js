const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/user", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Post {
//     userId: the ObjectId of the user,
//     title: String, required, min 10, max 20
//     body: String, required, min 10, max 500

//     tags:[String], optional, max length for each tag is 10
//     createdAt: timeStamp,
//     updatedAt: timeStamp
//     }

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 20,
    },
    body: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },
    tags: [
      {
        type: String,

        maxlength: 10,
        required: false,
      },
    ],
    // createdAt: {

    // },
    // updatedAt: {

    // },
  },
  {
    timeStamp: true,
  }
);
const Post = mongoose.model("Post", schema);
module.exports = Post;
// const kitty = new user({ name: "Zildjian" });
// kitty.save().then(() => console.log("meow"));
