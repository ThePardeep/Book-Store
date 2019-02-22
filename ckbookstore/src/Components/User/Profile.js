import React, { Component } from "react";
import Axios from "axios";
class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Profile: "",
      error: false,
      msg: "",
      isLoading: true
    };
    this.getProfile = this.getProfile.bind(this);
  }

  componentDidMount() {
    this.getProfile();
  }

  getProfile() {
    if (this.props.IsAuth) {
      const Token = localStorage.getItem("token");
      Axios.defaults.headers = {
        Authorization: Token
      };
      Axios.get("/api/user/profile")
        .then(res => {
          console.log(res);
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
          "Loading"
        ) : (
          <div className="card">
            <div className="card-header">
              <h1>Name : {this.state.Profile.Name.toUpperCase()}</h1>
              <p>Email : {this.state.Profile.email}</p>
              <button className="btn btn-primary" onClick={this.props.Logout}>
                LogOut
              </button>
            </div>
            <div className="card-body" />
          </div>
        )}
      </div>
    );
  }
}

export default Profile;
