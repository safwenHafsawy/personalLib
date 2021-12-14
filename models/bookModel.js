const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  title: String,
  comments: [String],
});

module.exports = mongoose.model("bookModel", bookSchema);
