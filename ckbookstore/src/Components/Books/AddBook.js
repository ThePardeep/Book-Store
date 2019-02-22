import React, { Component } from "react";
import Axios from "axios";
import PropTypes from "prop-types";

export default class AddBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookTitle: "",
      bookPrice: "",
      bookDesc: "",
      msg: "",
      error: false
    };
    this.HandleChange = this.HandleChange.bind(this);
    this.SubmitBook = this.SubmitBook.bind(this);
  }
  HandleChange(e) {
    var Name = e.target.name;
    var Value = e.target.value;
    if (Name === "bookTitle") {
      this.setState({
        bookTitle: Value
      });
    } else if (Name === "bookDesc") {
      this.setState({
        bookDesc: Value
      });
    } else if (Name === "bookPrice") {
      this.setState({
        bookPrice: Value
      });
    }
  }
  SubmitBook(e) {
    e.preventDefault();
    if (this.state.bookTitle === "") {
      this.setState({
        msg: "Pls Enter Correct Details",
        error: true
      });
      return;
    } else if (this.state.bookDesc === "") {
      this.setState({
        msg: "Pls Enter Correct Details",
        error: true
      });
      return;
    } else if (this.state.bookPrice === "") {
      this.setState({
        msg: "Pls Enter Correct Details",
        error: true
      });
      return;
    } else {
      const Book = {
        bookTitle: this.state.bookTitle,
        bookDesc: this.state.bookDesc,
        bookPrice: this.state.bookPrice
      };
      const Token = localStorage.getItem("token");
      Axios.defaults.headers = {
        Authorization: Token
      };
      Axios.post("/api/book/add", Book).then(res => {
        window.location = "/";
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.error === true ? (
          <h4 className="alert alert-danger">{this.state.msg}</h4>
        ) : (
          ""
        )}
        <form onSubmit={this.SubmitBook}>
          <div>
            <label htmlFor="bookTitle">Book Title</label> <br />
            <input
              className="form-control"
              type="text"
              placeholder="Add Book Title"
              value={this.state.bookTitle}
              onChange={this.HandleChange}
              name="bookTitle"
              id="bookTitle"
            />
          </div>
          <div>
            <label htmlFor="bookDesc">Book Desc</label> <br />
            <input
              className="form-control"
              type="text"
              name="bookDesc"
              id="bookDesc"
              placeholder="Add Book Desc"
              value={this.state.bookDesc}
              onChange={this.HandleChange}
            />
          </div>
          <div>
            <label htmlFor="bookPrie">Book Price</label> <br />
            <input
              className="form-control"
              type="text"
              name="bookPrice"
              id="bookPrice"
              placeholder="Add Book Price"
              value={this.state.bookPrice}
              onChange={this.HandleChange}
            />
          </div>
          <br />
          <button type="submit" className="btn btn-dark btn-block">
            Add Book
          </button>
        </form>
      </div>
    );
  }
}

AddBook.contextTypes = {
  router: PropTypes.object
};
