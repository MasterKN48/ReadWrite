import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Navbar from "./core/NavBar";
import Signup from "./user/Signup";
import Profile from "./user/Profile";
import Login from "./user/Login";
import User from "./user/User";
import EditProfile from "./user/EditProfile";
import Findpeople from "./user/Findpeople";
import Post from "./post/Post";
import PrivateRoute from "./auth/PrivateRoute";
import SinglePost from "./post/SinglePost";
import EditPost from "./post/EditPost";
import ForgotPassword from "./user/ForgetPassword";
import ResetPassword from "./user/ResetPassword";
import Admin from "./admin/Admin";
import StickyFooter from "react-sticky-footer";

const NoMatchPage = () => {
  return (
    <div id="main">
      <div className="fof">
        <h1>Error 404</h1>
      </div>
    </div>
  );
};
const Router = () => (
  // eslint-disable-next-line no-unused-expressions
  <div>
    <Navbar />
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/signup" exact component={Signup} />
      <Route path="/post/:postId" exact component={SinglePost} />
      <PrivateRoute exact path="/admin" component={Admin} />
      <PrivateRoute path="/user/:userId" exact component={Profile} />
      <PrivateRoute path="/post/edit/:postId" exact component={EditPost} />
      <PrivateRoute path="/user/edit/:userId" exact component={EditProfile} />
      <PrivateRoute path="/findpeople" exact component={Findpeople} />
      <PrivateRoute path="/create/post" exact component={Post} />
      <Route path="/login" exact component={Login} />
      <Route path="/users" exact component={User} />
      <Route exact path="/forgot-password" component={ForgotPassword} />
      <Route
        exact
        path="/reset-password/:resetPasswordToken"
        component={ResetPassword}
      />
      <Route component={NoMatchPage} />
    </Switch>
    <StickyFooter
      className="jumbrotron"
      bottomThreshold={50}
      normalStyles={{
        backgroundColor: "#0E2F56",
        padding: "2rem",
        color: "white",
        textAlign: "center",
      }}
      stickyStyles={{
        backgroundColor: "rgba(14, 47, 86,.8)",
        padding: "2rem",
      }}
    >
      ReadWrite 2020 <br />
      This is dummy project
    </StickyFooter>
  </div>
);

export default Router;
