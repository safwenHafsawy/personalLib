"use strict";

const {
  createBook,
  fetchAllBooks,
  fetchOneBook,
  addComments,
  deleteAllBooks,
  deleteOneBook,
} = require("../controllers/bookCntl");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(fetchAllBooks)

    .post(createBook)

    .delete(deleteAllBooks);

  app
    .route("/api/books/:id")
    .get(fetchOneBook)

    .post(addComments)

    .delete(deleteOneBook);
};
