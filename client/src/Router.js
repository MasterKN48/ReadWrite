import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import NotFound from "./assets/404.webp";
import Navbar from "./core/NavBar";
import EditProfile from "./user/EditProfile";

const Home = lazy(() => import("./core/Home"));
const Signup = lazy(() => import("./user/Signup"));
const Login = lazy(() => import("./user/Login"));
const Profile = lazy(() => import("./user/Profile"));
const User = lazy(() => import("./user/User"));
const Findpeople = lazy(() => import("./user/Findpeople"));
const Post = lazy(() => import("./post/Post"));
const SinglePost = lazy(() => import("./post/SinglePost"));
const EditPost = lazy(() => import("./post/EditPost"));
const ForgotPassword = lazy(() => import("./user/ForgetPassword"));
const ResetPassword = lazy(() => import("./user/ResetPassword"));
const Admin = lazy(() => import("./admin/Admin"));

const NoMatchPage = () => {
  return (
    <div id="error">
      <img src={NotFound} alt="404" style={{ height: "90vh" }} />
    </div>
  );
};

const Router = () => (
  // eslint-disable-next-line no-unused-expressions
  <div id="main">
    <Navbar />
    <Suspense
      fallback={
        <div align="center" className="ui segment">
          <div className="ui active inverted dimmer">
            <div className="ui text loader">Loading</div>
          </div>
          <p></p>
        </div>
      }
    >
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/post/:postId" component={SinglePost} />
        <PrivateRoute path="/admin" component={Admin} />
        <PrivateRoute path="/user/:userId" component={Profile} />
        <PrivateRoute path="/posts/edit/:postId" component={EditPost} />
        <PrivateRoute path="/profile/edit/:userId" component={EditProfile} />
        <PrivateRoute path="/findpeople" component={Findpeople} />
        <PrivateRoute path="/create/post" component={Post} />
        <Route path="/login" component={Login} />
        <Route path="/users" component={User} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route
          path="/reset-password/:resetPasswordToken"
          component={ResetPassword}
        />
        <Route component={NoMatchPage} />
      </Switch>
    </Suspense>
  </div>
);

export default Router;
