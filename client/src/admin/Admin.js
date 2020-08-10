import React, { Component } from "react";
import Allpost from "../post/Allpost";
import User from "../user/User";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";

class Admin extends Component {
  state = {
    redirectToHome: false,
  };

  // then on componentDidMount()
  componentDidMount() {
    if (isAuthenticated().user.role !== "admin") {
      this.setState({ redirectToHome: true });
    }
  }
  render() {
    if (this.state.redirectToHome) {
      return <Redirect to="/" />;
    }
    return (
      <div className='m-4'>
        <div className="jumbotron">
          <h2>Admin Dashboard</h2>
          <p className="lead">Welcome to React Frontend</p>
        </div>
        <div className="container">
          <h2>Posts</h2>
          <hr />
          <Allpost />
        </div>

        <div className="container">
          <h2>Users</h2>
          <hr />
          <User />
        </div>
      </div>
    );
  }
}

export default Admin;
