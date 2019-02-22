import React, { Component } from "react";
import { Link } from "react-router-dom";
import Books from "../Books/Books";

export default class DashBoard extends Component {

  
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-10">
            <h1 className="mb-2">
              <i className="fas fa-book" /> Books{" "}
            </h1>
            {this.props.data.status !== 200 ? (
              <Books
                Books={this.props.data.Books}
                FetchBooks={this.props.FetchBooks}
                IsAuth={this.props.data.IsAuth}
              />
            ) : (
              ""
            )}
          </div>
          <div className="col-md-2">
            {this.props.data.IsAuth === true ? (
              <Link className="btn btn-dark btn-block" to={`book/add`}>
                {" "}
                Add New Book
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}
