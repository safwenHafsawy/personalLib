const bookModel = require("../models/bookModel");

const createBook = (req, res) => {
  if (!req.body.hasOwnProperty("title"))
    return res.status(200).send("missing required field title");
  const { title } = req.body;
  const book = new bookModel({ title, commentcount: 0, comments: [] });
  book
    .save()
    .then((record) => {
      res.status(201).json({ _id: record._id, title: record.title });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const fetchAllBooks = (req, res) => {
  bookModel
    .find()
    .then((records) => {
      const result = [];
      records.forEach((record) => {
        let { title, _id, comments, commentcount } = record._doc;
        commentcount = comments.length - 1;
        result.push({ title, _id, commentcount });
      });
      res.json(result);
    })
    .catch((err) => {
      res.json({ err });
    });
};

const fetchOneBook = (req, res) => {
  const id = req.params.id;
  bookModel
    .findById(id)
    .then((record) => {
      if (record === null) return res.send("no book exists");
      return res.json({
        _id: record._id,
        title: record.title,
        comments: record.comments,
      });
    })
    .catch((err) => {
      res.send("no book exists");
    });
};

const addComments = (req, res) => {
  if (!req.body.hasOwnProperty("comment"))
    return res.send("missing comment field");
  const _id = req.params.id;
  const comment = req.body.comment;

  bookModel
    .findByIdAndUpdate(_id, { $push: { comments: comment } })
    .then((record) => {
      res.json({
        _id: record.id,
        title: record.title,
        comments: record.comments,
      });
    })
    .catch(() => res.send("no book exists"));
};

const deleteAllBooks = (req, res) => {
  bookModel
    .deleteMany()
    .then(() => {
      res.send("complete delete successful");
    })
    .catch(() => {
      res.send("could not delete");
    });
};

const deleteOneBook = (req, res) => {
  const _id = req.params.id;
  bookModel
    .deleteOne({ _id })
    .then((result) => {
      if (result.deletedCount === 0) return res.send("no book found");
      return res.send("delete successful");
    })
    .catch(() => {
      return res.send("no book found");
    });
};

module.exports = {
  createBook,
  fetchAllBooks,
  fetchOneBook,
  addComments,
  deleteAllBooks,
  deleteOneBook,
};
