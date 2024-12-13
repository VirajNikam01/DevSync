const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      minLength: 2,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);

module.exports = Post;
