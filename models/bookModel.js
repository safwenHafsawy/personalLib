const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  title: String,
  commentcount: Number,
  comments: [String],
});

module.exports = mongoose.model("bookModel", bookSchema);
