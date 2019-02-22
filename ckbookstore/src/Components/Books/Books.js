import React, { Component } from "react";
import { Link } from "react-router-dom";
import { GridLoader } from "react-spinners";
import PropTypes from "prop-types";
import "../../Css/style.css";
import Axios from "axios";

class Books extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: "",
      error: false
    };
    this.DeleteBook = this.DeleteBook.bind(this);
    this.addToCart = this.addToCart.bind(this);
  }

  makeDeleteReq(e) {
    e.preventDefault();
    const Token = localStorage.getItem("token");
    Axios.defaults.headers = {
      Authorization: Token
    };
    Axios.post("/api/book/delete", {
      id: e.target.id.value
    })
      .then(res => {
        this.setState({
          msg: "SuccessFully Deleted"
        });
        this.props.FetchBooks();
        if(this.state.msg !=='') {
          setInterval(()=>{
            this.setState({
              msg : ""
            })
          },4000);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  //@ ADD TO CART

  addToCart(e) {
    e.preventDefault();
    const Token = localStorage.getItem("token");
    if(!Token) {
      window.location = "/login";
      return;
    }
    const Id = e.target.id.value;
    if (Id) {
      const Token = localStorage.getItem("token");
      Axios.defaults.headers = {
        Authorization: Token
      };
      Axios.post("/api/cart/add", {
        id : Id
      }).then(res => {
        if(!res.data.error) {
          window.location = "/cart"
        } else {
          this.setState({
            msg: res.data.msg,
            error : res.data.error
          });
        }
      })
      .catch(err => {
        throw err;
      })
    }
  }

  // Delete Book

  DeleteBook() {
    return this.makeDeleteReq.bind(this);
  }

  getBooks(books) {
    return books.map(book => {
      return (
        <tr key={book._id}>
          <td>{book.bookTitle}</td>
          <td>{book.bookDesc.substring(0, 29)}</td>
          <td>{`${book.bookPrice} INR`}</td>
          <td>
            <form onSubmit={this.addToCart}>
              <input type="hidden" value={book._id} name="id" />
              <button type="submit" className="btn btn-danger">
                Add To Cart
              </button>
            </form>
          </td>
          {this.props.IsAuth === true ? (
            <td>
              <form onSubmit={this.DeleteBook()}>
                <div>
                  <input type="hidden" name="id" value={book._id} />
                </div>
                <button type="submit" title="Delete" className="btn btn-dark">
                  <i className="fas fa-times" />
                </button>
              </form>
              <Link
                style={{ marginTop: "4px" }}
                to={`/book/update/${book._id}`}
                title="Edit"
                className="btn btn-dark"
              >
                <i className="fas fa-edit" />
              </Link>
            </td>
          ) : (
            ""
          )}
        </tr>
      );
    });
  }

  render() {
    var books = this.props.Books;
    return (
      <div>
        {this.state.msg === "" ? (
          ""
        ) : (
          <p className="alert alert-success">{this.state.msg}</p>
        )}
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Book Title</th>
              <th scope="col">Book Description</th>
              <th scope="col">Book Price</th>
              <th scope="col">Buy</th>
            </tr>
          </thead>
          <tbody>
            {this.props.Books !== "" ? (
              this.getBooks(books)
            ) : (
              <tr style={{ margin: "100px" }}>
                <GridLoader />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

Books.contextTypes = {
  router: PropTypes.object
};
export default Books;
