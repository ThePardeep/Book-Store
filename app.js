const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// Import Keys File
const Key = require("./Config/Keys.js");

// Connect Mongoose
mongoose
  .connect(Key.MongoUrl, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("MongoDb Connected");
  })
  .catch(err => console.log(err));

// Passport MiddleWare

app.use(passport.initialize());
//JWT Auth File
require("./Strategy/JWT/jwt.js")(passport);

// Body Parser MiddelWare

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Import Book Model
const BookSchema = require("./Schema/Book");

// @ROUTE-NAME : /api
// @ROUTE-TYPE : GET
// @ROUTE-DESC : HOME ROUTE
// @ACCESS : PUBLIC
app.get("/api", (req, res) => {
  // const B = {
  //   bookTitle: "C++ Language",
  //   bookDesc: "Learn C++ Language From Book",
  //   bookPrice: "100 INR"
  // };
  // new BookSchema(B).save().then(book => {
  //   console.log(book).catch(err => console.log(err));
  // });
  res.status(200).json({
    msg: "hello"
  });
});

// @ROUTE-NAME : /api/books
// @ROUTE-TYPE : GET
// @ROUTE-DESC : GET ALL BOOKS
// @ACCESS : PUBLIC

app.get("/api/books", (req, res) => {
  BookSchema.find({ Sold: false }).then(books => {
    if (books) {
      res.status(200).json({
        Books: books,
        status: "200"
      });
      return;
    }
    res.status(200).json({
      msg: "No Book",
      status: "200"
    });
  });
});

//Import Book Route

const BookRoute = require("./Route/api/Books/Books.js");

// Import User Route

const UserRoute = require("./Route/api/User/User.js");

//Import Cart Route

const CartRoute = require("./Route/api/Cart/Cart.js");

app.use("/api/book", BookRoute);
app.use("/api/user", UserRoute);
app.use("/api/cart", CartRoute);

//PRODUCTION Setup

if (process.env.NODE_ENV === "production") {  
  // SET STATIC FOLDER
  app.use(express.static("ckbookstore/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "ckbookstore", "build", "index.html"));
  });
}

// CONNECT SERVER

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("SERVER Running At Port : " + PORT);
});
