const express = require("express");
const Router = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;
const passport = require("passport");
// Import Book Model
const BookSchema = require("../../../Schema/Book.js");

// @ROUTE-NAME : /api/book/add
// @ROUTE-TYPE : POST
// @ROUTE-DESC : INSERT NEW BOOK
// @ACCESS : PRIVATE

Router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const Book = {
      bookTitle: req.body.bookTitle,
      bookDesc: req.body.bookDesc,
      bookPrice: req.body.bookPrice
    };
    new BookSchema(Book)
      .save()
      .then(book => {
        res.status(200).json({
          Book: Book,
          error : false,
          msg : "Book SuccessFully Added"
        });
      })
      .catch(err => {
        throw err;
      });
  }
);

// @ROUTE-NAME : /api/book/delete
// @ROUTE-TYPE : GET
// @ROUTE-DESC : DELETE BOOK
// @ACCESS : PRIVATE

Router.post("/delete", passport.authenticate("jwt", { session: false }), (req, res) => {
  if (req.body.id) {
    const id = req.body.id;
    BookSchema.findByIdAndDelete(id)
      .then(book => {
        res.status(200).json({
          Book: book,
          error: false,
          msg: "Book Remove SuccessFully"
        });
      })
      .catch(err => {
        res.status(404).json({
          error: true,
          msg: err.msg
        });
      });
  } else {
    res.status(404).json({
      error: true,
      msg: "Book Not Found"
    });
  }
});

// @ROUTE-NAME : /api/book/update
// @ROUTE-TYPE : GET
// @ROUTE-DESC : Fetch Data For Updating Book
// @ACCESS : PRIVATE

Router.get("/update/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    BookSchema.findById(req.params.id)
      .then(book => {
        if (book) {
          res.status(200).json({
            Book: book,
            error: false,
            msg: "Success"
          });
          return;
        } else {
          res.status(404).json({
            error: true,
            msg: "Book Not Found"
          });
          return;
        }
      })
      .catch(err => {
        console.log(err);
        res.status(404).json({
          error: true,
          msg: "Book Not Found"
        });
      });
    return;
  }

  res.status(200).json({
    error: true,
    msg: "Book Not Found"
  });
});

// @ROUTE-NAME : /api/book/update
// @ROUTE-TYPE : POSt
// @ROUTE-DESC : Submit Data For Updataing a Book
// @ACCESS : PRIVATE

Router.post("/update", passport.authenticate("jwt", { session: false }), (req, res) => {
  if (ObjectId.isValid(req.body.id)) {
    const ID = req.body.id;
    const Book = {
      bookTitle: req.body.bookTitle,
      bookDesc: req.body.bookDesc,
      bookPrice: req.body.bookPrice
    };
    BookSchema.findByIdAndUpdate(ID, Book)
      .then(book => {
        if (book) {
          res.status(200).json({
            Book: book,
            error: false,
            msg: "Updating SucessFully"
          });
          return;
        } else {
          res.status(200).json({
            error: true,
            msg: "Updating UnSucessFull"
          });
          return;
        }
      })
      .catch(err => {
        res.status(200).json({
          error: true,
          msg: "Updating UnSucessFull",
          err: err
        });
      });
  } else {
    res.status(200).json({
      error: true,
      msg: "Book Not Found"
    });
    return;
  }
});

module.exports = Router;
