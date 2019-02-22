const Express = require("express");
const Router = Express.Router();
const bcrypt = require("bcrypt");
const JsonWt = require("jsonwebtoken");
const Keys = require("../../../Config/Keys.js");
const passport = require("passport");
const ObjectId = require("mongoose").Types.ObjectId;
const BookSchema = require("../../../Schema/Book");
// User Schema

const UserSchema = require("../../../Schema/User.js");

// @ROUTE-NAME : /api/user/register
// @ROUTE-TYPE : POST
// @ROUTE-DESC : For Register New User
// @ACCESS : PUBLIC

Router.post("/register", (req, res) => {
  const newUSer = {
    Name: req.body.Name,
    Email: req.body.Email,
    Password: req.body.Password
  };

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUSer.Password, salt, function(err, hash) {
      newUSer.Password = hash;
      UserSchema.findOne({ Email: newUSer.Email })
        .then(CheckUser => {
          if (CheckUser) {
            res.json({
              error: true,
              msg: "User Already Exist"
            });
            return;
          }
          new UserSchema(newUSer).save().then(user => {
            res.status(200).json({
              User: user,
              error: false,
              msg: "Succesfully Register"
            });
          });
        })
        .catch(err => {
          throw err;
        });
    });
  });
});

// @ROUTE-NAME : /api/user/login
// @ROUTE-TYPE : POST
// @ROUTE-DESC : Login User
// @ACCESS : PUBLIC

Router.post("/login", (req, res) => {
  const User = {
    Email: req.body.email,
    Password: req.body.password
  };
  UserSchema.findOne({
    Email: User.Email
  })
    .then(user => {
      if (user) {
        bcrypt.compare(User.Password, user.Password, (err, Match) => {
          if (Match) {
            const Payload = {
              id: user._id,
              email: user.Email
            };
            JsonWt.sign(
              Payload,
              Keys.Secret,
              {
                expiresIn: "1h"
              },
              (err, token) => {
                if (err) {
                  throw err;
                } else {
                  res.status(200).json({
                    error: false,
                    token: "Bearer   " + token
                  });
                }
              }
            );
          } else {
            res.status(200).json({
              error: true,
              msg: "Password Not Match"
            });
          }
        });
        return;
      }
      res.status(200).json({
        error: true,
        msg: "User Not Found"
      });
    })
    .catch(err => {
      throw err;
    });
});

Router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user) {
      const UserData = {
        Name: req.user.Name,
        email: req.user.Email,
        id: req.user._id
      };
      res.status(200).json({
        user: UserData,
        error: false
      });
    }
  }
);

// @ROUTE-NAME : /api/user/books
// @ROUTE-TYPE : GET
// @ROUTE-DESC : Fetch User Books
// @ACCESS : PRIVATE

Router.get(
  "/books",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const UserID = req.user._id;
    UserSchema.findById(UserID)
      .select("BuyedBooks")
      .then(BuyedBooks => {
        if (BuyedBooks) {
          const BookIds = [],
            CartArray = BuyedBooks.BuyedBooks;
          CartArray.forEach(ele => {
            BookIds.push(ObjectId(`${ele.BookId}`));
          });
          BookSchema.find({
            _id: { $in: BookIds }
          })
            .then(Books => {
              if (Books) {
                res.status(200).json({
                  Books: Books,
                  error: false
                });
              }
            })
            .catch(err => {
              throw err;
            });
        }
      })
      .catch(err => {
        throw err;
      });
  }
);

// @ROUTE-NAME : /api/user/book/remove
// @ROUTE-TYPE : POST
// @ROUTE-DESC : Remove Book From User Book
// @ACCESS : PRIVATE

Router.post(
  "/book/remove",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const UserID = req.user._id;
    UserSchema.findById(UserID)
      .select("BuyedBooks")
      .then(BuyedBooks => {
        const BookId = req.body.id;
        var I = false,
          BuyedBooksId;
        if (BuyedBooks) {
          BuyedBooks.BuyedBooks.map(data => {
            if (data.BookId == BookId) {
              I = true;
              BuyedBooksId = data._id;
              return;
            }
          });
        }
        if (I) {
          BuyedBooks.BuyedBooks.pull({ _id: BuyedBooksId });
          BuyedBooks.save().then(BuyedBooks => {
            if (BuyedBooks) {
              // Chnage Book Sold Status
              BookSchema.findById(BookId)
              .then(Book =>{
                if(Book) {
                  Book.Sold = false;
                  Book.save();
                  res.status(200).json({
                    Book: Book,
                    error: false
                  });
                }
              }) 
              return;
            }
            res.json({
              error: true,
              msg: "Book Not Found"
            });
          });
        } else {
          res.json({
            error: true,
            msg: "Book Not Found"
          });
        }
      })
      .catch(err => {
        throw err;
      });
  }
);

module.exports = Router;
