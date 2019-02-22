import React, { Component } from "react";
import Axios from "axios";
import { BarLoader } from "react-spinners";
class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Profile: "",
      error: false,
      msg: "",
      isLoading: true,
      BookLoading: true,
      Books: ""
    };
    this.getProfile = this.getProfile.bind(this);
    this.getUserBooks = this.getUserBooks.bind(this);
    this.RemoveBook = this.RemoveBook.bind(this);
  }

  componentDidMount() {
    this.getProfile();
    this.getUserBooks();
  }

  RemoveBook(e) {
    e.preventDefault();
    if (this.props.IsAuth) {
      const Token = localStorage.getItem("token");
      Axios.defaults.headers = {
        Authorization: Token
      };
      Axios.post("/api/user/book/remove", {
        id: e.target.id.value
      })
        .then(res => {
          if (!res.data.error) {
            this.setState({
              BookLoading: true
            });
            this.getUserBooks();
          }
        })
        .catch(err => {
          throw err;
        });
    }
  }
  getUserBooks() {
    if (this.props.IsAuth) {
      const Token = localStorage.getItem("token");
      Axios.defaults.headers = {
        Authorization: Token
      };
      Axios.get("/api/user/books")
        .then(res => {
          if (!res.data.error) {
            this.setState({
              error: res.data.error,
              Books: res.data.Books,
              BookLoading: false
            });
          }
        })
        .catch(err => {
          throw err;
        });
    }
  }

  getProfile() {
    if (this.props.IsAuth) {
      const Token = localStorage.getItem("token");
      Axios.defaults.headers = {
        Authorization: Token
      };
      Axios.get("/api/user/profile")
        .then(res => {
          if (res.data.error) {
            window.location = "/login";
          } else {
            this.setState({
              isLoading: false,
              Profile: res.data.user,
              error: res.data.error
            });
          }
        })
        .catch(err => {
          if (err.response.status === 401) {
            window.location = "/login";
            return;
          }
          throw err;
        });
    }
  }
  render() {
    return (
      <div className="profile">
        {this.state.isLoading === true ? (
          <BarLoader sizeUnit={"px"} size={80} />
        ) : (
          <div className="card">
            <div className="card-header">
              <h1>Name : {this.state.Profile.Name.toUpperCase()}</h1>
              <p>Email : {this.state.Profile.email}</p>
              <button className="btn btn-primary" onClick={this.props.Logout}>
                LogOut
              </button>
              <a href="/cart" className="mt-3 btn btn-success btn-block">
                Cart
              </a>
            </div>
            <div className="card-body">
              <div>
                <h1>Your Books </h1>
                <hr style={{ border: "2px solid black" }} />
              </div>
              {this.state.BookLoading === true ? (
                <BarLoader sizeUnit={"px"} size={80} />
              ) : (
                <div className="user-books">
                  {this.state.Books.map(book => (
                    <div
                      key={book._id}
                      className="card book-card"
                      style={{ width: "15rem" }}
                    >
                      <div className="card-body">
                        <h4>{book.bookTitle}</h4>
                        <hr style={{ border: "2px solid black" }} />
                        <h5>BookDesc : {book.bookDesc}</h5>
                        <h5>BookPrice : {book.bookPrice}</h5>
                        <form onSubmit={this.RemoveBook}>
                          <input type="hidden" name="id" value={book._id} />
                          <button
                            type="submit"
                            className="btn btn-block btn-danger"
                          >
                            Remove
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Profile;
