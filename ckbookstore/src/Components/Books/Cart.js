import React, { Component, Fragment } from "react";
import Axios from "axios";
import { HashLoader } from "react-spinners";

export default class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      CartItem: "",
      Total: 0,
      msg: "",
      error: false
    };
    this.FindTotal = this.FindTotal.bind(this);
    this.RemoveFromCart = this.RemoveFromCart.bind(this);
  }

  componentDidMount() {
    this.FetchCartItem();
  }

  FetchCartItem() {
    const Token = localStorage.getItem("token");
    if (Token) {
      Axios.defaults.headers = {
        Authorization: Token
      };
      Axios.get("/api/cart")
        .then(res => {
          if (!res.data.error) {
            var Total = this.FindTotal(res.data.Books);
            this.setState({
              isLoading: false,
              CartItem: res.data.Books,
              error: res.data.error,
              Total
            });
            return;
          }
          this.setState({
            isLoading: false,
            error: res.data.error
          });
        })
        .catch(err => {
          throw err;
        });
    } else {
      window.location = "/login";
    }
  }

  FindTotal(Books) {
    var Total = 0;
    for (let index = 0; index < Books.length; index++) {
      Total = Total + Number(Books[index].bookPrice);
    }
    return Total;
  }

  RemoveFromCart(e) {
    e.preventDefault();
    const Id = e.target.id.value;
    if (Id) {
      const Token = localStorage.getItem("token");
      Axios.defaults.headers = {
        Authorization: Token
      };
      Axios.post("/api/cart/remove", {
        id: Id
      })
        .then(res => {
          if (res.data.Cart.length < 0) {
            return;
          }
          if (!res.data.error) {
            this.setState({
              isLoading: true
            });
            this.FetchCartItem();
            return;
          }
          this.setState({
            isLoading: false,
            error: res.data.error
          });
        })
        .catch(err => {
          throw err;
        });
    }
  }
  ProcedeCart() {
    const Cart = this.state.CartItem;
    if (Cart.length > 0) {
      var Token = localStorage.getItem("token");
      Axios.defaults.headers = {
        Authorization: Token
      };
      Axios.post("/api/cart/buy", {
        Cart: Cart
      })
        .then(res => {
          if (!res.data.error) {
            window.location = "/profile";
            return;
          }
          this.setState({
            error: true,
            msg: "Some Error"
          });
        })
        .catch(err => {
          throw err;
        });
    } else {
      this.setState({
        msg: "Cart  Is Empty"
      });
    }
  }
  render() {
    return (
      <Fragment>
        <div>
          <h1>Cart </h1>
          <hr style={{ border: "2px solid black" }} />
          <div className="cart">
            {this.state.msg === "" ? (
              ""
            ) : (
              <p className="alert alert-danger">{this.state.msg}</p>
            )}
            {this.state.isLoading === true ? (
              <div className="align-middle">
                <HashLoader sizeUnit={"px"} size={80} color={"#7eff"} />
              </div>
            ) : (
              <div className="card">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Book Price</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.CartItem.map(book => (
                      <tr key={book._id}>
                        <td>{book.bookTitle}</td>
                        <td>{book.bookPrice} INR</td>
                        <td>
                          <form onSubmit={this.RemoveFromCart}>
                            <input type="hidden" value={book._id} name="id" />
                            <button type="submit" className="btn btn-danger">
                              Remove
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">
                        <h2>Total : </h2>
                      </div>
                      <div className="col-6">
                        <h2>{this.state.Total} INR </h2>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <hr />
                        <button
                          onClick={this.ProcedeCart.bind(this)}
                          className=" mt-4 btn btn-block btn-primary"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}
