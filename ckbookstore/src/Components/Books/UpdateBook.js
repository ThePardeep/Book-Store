import React, { Component } from "react";
import Axios from "axios";
import { GridLoader } from "react-spinners";

export default class UpdateBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookTitle: "",
      bookPrice: "",
      bookDesc: "",
      id: "",
      msg: "",
      error: false,
      isLoading: true
    };
    this.HandleChange = this.HandleChange.bind(this);
    this.UpdateBook = this.UpdateBook.bind(this);
  }

  componentWillMount() {
    const ID = window.location.pathname.split("/")[3];
    const Token = localStorage.getItem("token");
      Axios.defaults.headers = {
        Authorization: Token
      };
    Axios.get(`/api/book/update/${ID}`).then(res => {
      const data = res.data;
      if (data.Book) {
        this.setState({
          id: data.Book._id,
          bookTitle: data.Book.bookTitle,
          bookDesc: data.Book.bookDesc,
          bookPrice: data.Book.bookPrice,
          isLoading: false
        });
        return;
      }
      if (data.error === true) {
        this.setState({
          error: data.error,
          msg: data.msg,
          isLoading: false
        });
      }
    });
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
  UpdateBook(e) {
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
        id: this.state.id,
        bookTitle: this.state.bookTitle,
        bookDesc: this.state.bookDesc,
        bookPrice: this.state.bookPrice
      };
      const Token = localStorage.getItem("token");
      Axios.defaults.headers = {
        Authorization: Token
      };
      Axios.post("/api/book/update", Book).then(res => {
        if(res.data.error) {
          this.setState({
            msg: res.data.msg,
            error: true
          });
          return;
        } else {
          window.location = "/";
          return;
        }
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading === true ? (
          <div className="ml-3">{<GridLoader />}</div>
        ) : (
          <div>
            {this.state.error === true ? (
              <h4 className="alert alert-danger">{this.state.msg}</h4>
            ) : (
              ""
            )}
            <form onSubmit={this.UpdateBook}>
              <div>
                <input type="hidden" name="id" value={this.state.id} />
              </div>
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
                Update Book
              </button>
            </form>
          </div>
        )}
      </React.Fragment>
    );
  }
}
