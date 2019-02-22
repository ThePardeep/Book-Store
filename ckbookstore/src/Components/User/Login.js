import React, { Component } from "react";
import Axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Email: "",
      Password: "",
      error: false,
      msg: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

  // Handle Change When User Enter Info..
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  // Handle Submit
  submitLogin(e) {
    e.preventDefault();
    if (this.state.Email === "") {
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
      const User = {
        email: this.state.Email,
        password: this.state.Password
      };

      Axios.post("/api/user/login", User)
        .then(res => {
          const Data = res.data;
          if(Data.error) {
           this.setState({
             error : res.data.error,
             msg : res.data.msg
           })
          } else {
            localStorage.setItem("IsAuth","Yes")
            localStorage.setItem("token",res.data.token)
            this.props.Login();
            return;
          }
        })
        .catch(err => {
          throw err;
        });
    }
  }

  render() {
    return (
      <div className="login">
        <div className="login-header">
          <h1>Login</h1>
          <hr style={{ border: "2px solid black" }} />
          {this.state.error === true ? (
            <p className="alert alert-danger">{this.state.msg}</p>
          ) : (
            ""
          )}
        </div>
        <div className="login-body">
          <form onSubmit={this.submitLogin}>
            <div>
              <label htmlFor="Email">Email :</label> <br />
              <input
                className="form-control"
                type="email"
                placeholder="Enter Your Email"
                value={this.state.Email}
                onChange={this.handleChange}
                name="Email"
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
                value={this.state.Password}
                onChange={this.handleChange}
                id="password"
              />
            </div>
            <br />
            <button type="submit" className="btn btn-primary btn-block">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
