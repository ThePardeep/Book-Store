const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const User = new Schema({
  Name: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  BuyedBooks : [
      {
       BookId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "Book"
       }
      }
  ],
  Cart : [
    {
      BookId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "Book"
      }
    }
  ]
});

module.exports = Mongoose.model("User", User);
