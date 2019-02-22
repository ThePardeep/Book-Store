import React, { Component } from "react";
import Axios from "axios";

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Name: "",
      Email: "",
      Password: "",
      error: false,
      msg: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitRegister = this.submitRegister.bind(this);
  }

  // Handle Change When User Enter Info..
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  // Handle Submit
  submitRegister(e) {
    e.preventDefault();
    if (this.state.Name === "") {
      this.setState({
        error: true,
        msg: "Enter Correct Name"
      });
      return;
    } else if (this.state.Email === "") {
      this.setState({
        error: true,
        msg: "Enter Correct Email"
      });
      return;
    } else if (this.state.Password === "") {
      this.setState({
        error: true,
        msg: "Enter Correct Password"
      });
      return;
    } else {
      const newUser = {
        Name: this.state.Name,
        Password: this.state.Password,
        Email: this.state.Email
      };
      Axios.post("/api/user/register", newUser)
        .then(user => {
          const UserData = user.data;
          if (UserData.error) {
            this.setState({
              error: true,
              msg: UserData.msg
            });
            return;
          }
          window.location = "/login";
        })
        .catch(err => {
          throw err;
        });
    }
  }
  render() {
    return (
      <div className="register">
        <div className="register-header">
          <h1>Register</h1>
          <hr style={{ border: "2px solid black" }} />
          {this.state.error === true ? (
            <p className="alert alert-danger">{this.state.msg}</p>
          ) : (
            ""
          )}
        </div>
        <div className="register-body">
          <form onSubmit={this.submitRegister}>
            <div>
              <label htmlFor="Name">Name :</label> <br />
              <input
                className="form-control"
                type="text"
                placeholder="Enter Your Name"
                name="Name"
                id="Name"
                value={this.state.Name}
                onChange={this.handleChange}
              />
            </div>
            <br />
            <div>
              <label htmlFor="Email">Email :</label> <br />
              <input
                className="form-control"
                type="email"
                placeholder="Enter Your Email"
                name="Email"
                value={this.state.Email}
                onChange={this.handleChange}
                id="Email"
              />
            </div>
            <br />
            <div>
              <label htmlFor="Password">Password :</label> <br />
              <input
                className="form-control"
                type="password"
                placeholder="Enter Password"
                name="Password"
                id="Password"
                value={this.state.Password}
                onChange={this.handleChange}
              />
            </div>
            <br />
            <button type="submit" className="btn btn-primary btn-block">
              Register
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
