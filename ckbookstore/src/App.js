import React, { Component } from "react";
import "./Css/style.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Header from "./Components/Layout/Header";
import Footer from "./Components/Layout/Footer";
import DashBoard from "./Components/Layout/DashBoard";
import AddBook from "./Components/Books/AddBook";
import UpdateBook from "./Components/Books/UpdateBook";
import Login from "./Components/User/Login";
import Cart from "./Components/Books/Cart";
import Profile from "./Components/User/Profile";
import axios from "axios";
import Register from "./Components/User/Register";
//import DB from './store';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Books: "",
      Status: "",
      IsAuth: false
    };
    this.Login = this.Login.bind(this);
    this.Logout = this.Logout.bind(this);
    this.FetchBooks = this.FetchBooks.bind(this);
  }

  Login() {
    const IsAuth = localStorage.getItem("IsAuth");
    if (IsAuth === "Yes") {
      this.setState({
        IsAuth: true
      });
    }
  }

  Logout() {
    const IsAuth = localStorage.getItem("IsAuth");
    if (IsAuth === "Yes") {
      localStorage.removeItem("token");
      localStorage.removeItem("IsAuth");
      this.setState({
        IsAuth: false
      });
    } else {
      window.location = "/login";
    }
  }

  componentWillMount() {
    this.Login();
    this.FetchBooks();
  }

  FetchBooks() {
    axios.get("/api/books").then(res => {
      this.setState({
        Books: res.data.Books,
        Status: res.data.status
      });
    });
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <Header auth={this.state.IsAuth} Logout={this.Logout} />
          <div className="container">
            <Switch>
              <Route
                exact
                path="/"
                render={() => <DashBoard data={this.state} FetchBooks={this.FetchBooks} />}
              />
              <Route
                exact={true}
                path="/book/add"
                render={() => {
                  if (this.state.IsAuth) {
                    return <AddBook />;
                  } else {
                    return <Redirect to="/login" />;
                  }
                }}
              />
              <Route
                path="/book/update/:id"
                render={() => {
                  if (this.state.IsAuth) {
                    return <UpdateBook />;
                  } else {
                    return <Redirect to="/login" />;
                  }
                }}
              />
              <Route
                exact
                path="/cart"
                render={() => {
                  if (this.state.IsAuth) {
                    return <Cart />;
                  } else {
                    return <Redirect to="/login" />;
                  }
                }}
              />
              <Route
                exact
                path="/login"
                render={() => {
                  if (this.state.IsAuth) {
                    return <Redirect to="/profile" />;
                  } else {
                    return <Login Login={this.Login} />;
                  }
                }}
              />
              <Route
                exact
                path="/register"
                render={() => {
                  if (this.state.IsAuth) {
                    return <Redirect to="/profile" />;
                  } else {
                    return <Register />;
                  }
                }}
              />
              <Route
                path="/profile"
                render={() => {
                  if (this.state.IsAuth) {
                    return (
                      <Profile
                        IsAuth={this.state.IsAuth}
                        Logout={this.Logout}
                      />
                    );
                  } else {
                    return <Redirect to="/login" />;
                  }
                }}
              />
            </Switch>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
