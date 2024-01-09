const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const Schema = mongoose.Schema;

mongoose.connect("mongodb://127.0.0.1:27017/pinterestdb");
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  dp: {
    type: String, // You can adjust the type based on how you store the profile picture.
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: false, // make it optional
  },
});

userSchema.plugin(plm);
module.exports = mongoose.model("User", userSchema);
