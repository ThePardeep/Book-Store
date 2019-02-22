import React, { Component } from "react";

class Header extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <a className="navbar-brand" href="/">
          CkBookStore
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
            {this.props.auth === true ? (
              <li className="nav-item active">
                <a className="nav-link" href="/book/add">
                  Add Book
                </a>
              </li>
            ) : (
              <li className="nav-item active">
                <a className="nav-link" href="/login">
                  Login
                </a>
              </li>
            )}
            {
              this.props.auth === true ? (
                <li className="nav-item active mr-3">
                <a className="btn btn-success btn-block mb-3 " href="/profile">
                 Profile
                </a>
              </li>
              ) : ('')
            }
            {this.props.auth === true ? (
              <li className="nav-item active mr-3">
                <a className="btn btn-success btn-block mb-2 " href="/cart">
                  Cart
                </a>
              </li>
            ) : (
              <li className="nav-item active">
                <a className="nav-link" href="/register">
                  Register
                </a>
              </li>
            )}
            {this.props.auth === true ? (
              <li  className="nav-item active">
                <button className="btn btn-danger btn-block mb-3" onClick={this.props.Logout}>
                  LogOut
                </button>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

export default Header;
