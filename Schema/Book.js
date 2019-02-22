const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Book = new Schema({
  bookTitle: {
    type: String,
    required: true
  },
  bookDesc: {
    type: String,
    required: true
  },
  bookPrice: {
    type: String,
    required: true
  },
  Sold : {
    type : Boolean,
    required : true,
    default : false
  }
});

module.exports = Mongoose.model("Book", Book);
