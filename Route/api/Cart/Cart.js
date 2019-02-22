const express = require("express");
const Router = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;
const passport = require("passport");

// Import Book And User Model
const BookSchema = require("../../../Schema/Book");
const UserSchema = require("../../../Schema/User");

// @ROUTE-NAME : /
// @ROUTE-TYPE : GET
// @ROUTE-DESC : GET ALL CART PRODUCT
// @ACCESS : PRIVATE

Router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const UserID = req.user._id;
    UserSchema.findById(UserID)
      .select("Cart")
      .then(Cart => {
        if (Cart) {
          //   res.status(200).json({
          //     CartItem: Cart.Cart,
          //     error: false
          //   });
          const BookIds = [],
            CartArray = Cart.Cart;
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

// @ROUTE-NAME : /api/cart/add
// @ROUTE-TYPE : POST
// @ROUTE-DESC : ADD BOOK TO USER CART
// @ACCESS : PRIVATE

Router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (ObjectId.isValid(req.body.id)) {
      const UserID = req.user._id;
      UserSchema.findById(UserID)
        .select("Cart")
        .then(data => {
          //New Cart Item
          const newCartItem = {
            BookId: req.body.id
          };

          //DeStructure CART From Response
          const Cart = data.Cart;
          //Check If Book AlReady Exist In Cart
          var I = false;
          Cart.forEach(element => {
            if (element.BookId == newCartItem.BookId) {
              I = true;
            }
          });

          if (I) {
            res.status(200).json({
              error: true,
              msg: "Book Already Exist In Cart"
            });
            return;
          } else {
            // UnShift New Book
            data.Cart.unshift(newCartItem);
            data
              .save()
              .then(cart => {
                res.status(200).json({
                  Cart: cart.Cart,
                  error: false
                });
              })
              .catch(err => {
                throw err;
              });
          }
        })
        .catch(err => {
          throw err;
        });
    } else {
      res.json({
        error: true,
        msg: "Invalid ID"
      });
    }
  }
);

// @ROUTE-NAME : /api/cart/remove
// @ROUTE-TYPE : POST
// @ROUTE-DESC : REMOVE BOOK FROM CART
// @ACCESS : PRIVATE

Router.post(
  "/remove",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const UserID = req.user._id;
    UserSchema.findById(UserID)
      .select("Cart")
      .then(Cart => {
        const BookId = req.body.id;
        var I = false,
          CartId;
        if (Cart) {
          Cart.Cart.map(data => {
            if (data.BookId == BookId) {
              I = true;
              CartId = data._id;
              return;
            }
          });
        }
        if (I) {
          Cart.Cart.pull({ _id: CartId });
          Cart.save().then(cart => {
            if (cart) {
              res.status(200).json({
                Cart: cart.Cart,
                error: false
              });
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
