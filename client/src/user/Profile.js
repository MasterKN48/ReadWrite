import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { read } from "./apiUser";
import Default from "./Default.png";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import ProfileTabs from "./ProfileTabs";
import { listByUser } from "../post/apiPost";
class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      error: "",
      posts: [],
    };
  }
  // check follow
  checkFollow = (user) => {
    const jwt = isAuthenticated();
    const match = user.followers.find((follower) => {
      // one id has many other ids (followers) and vice versa
      return follower._id === jwt.user._id;
    });
    return match;
  };

  clickFollowButton = (callApi) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    callApi(userId, token, this.state.user._id)
      .then((data) => {
        console.log(data);
        this.setState({ user: data, following: !this.state.following });
      })
      .catch((err) => this.setState({ error: err.response }));
  };

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token)
      .then((data) => {
        listByUser(userId, token).then((res) => {
          this.setState({ posts: res });
        });
        let following = this.checkFollow(data.data);
        this.setState({ user: data.data, following });
      })
      .catch((error) => {
        console.error(error.response);
        this.setState({ redirectToSignin: true });
      });
  };
  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }

  render() {
    const { redirectToSignin, posts, user } = this.state;
    if (redirectToSignin) return <Redirect to="/login" />;

    const photoUrl = user._id ? `/api/user/photo/${user._id}` : Default;

    return (
      <div className='m-4'>
      <div className="container">
        <h2 className="mt-5 mb-5">Profile</h2>
        <div className="row">
          <div className="col-md-4">
            <img
              style={{ height: "200px", width: "auto" }}
              className="img-thumbnail"
              src={photoUrl}
              onError={(i) => {
                i.target.src = `${Default}`;
              }}
              alt={user.name}
            />
          </div>

          <div className="col-md-8">
            <div className="lead mt-2">
              <p>Hello {user.name}</p>
              <p>Email: {user.email}</p>
              <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
            </div>

            {isAuthenticated().user &&
            isAuthenticated().user._id === user._id ? (
              <div className="d-inline-block">
                <Link
                  className="btn btn-raised btn-info mr-5"
                  to={`/create/post`}
                >
                  Create Post
                </Link>

                <Link
                  className="btn btn-raised btn-success mr-5"
                  to={`/profile/edit/${user._id}`}
                >
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            ) : (
              <FollowProfileButton
                following={this.state.following}
                onButtonClick={this.clickFollowButton}
              />
            )}
          </div>
          <hr />
        </div>
        <div className="row">
          <div className="col md-12 mt-5 mb-5">
            <hr />
            <p className="lead">{user.about}</p>
            <hr />
            <ProfileTabs
              posts={posts}
              followers={this.state.user.followers}
              following={this.state.user.following}
            />
          </div>
        </div>
        <div>
          {isAuthenticated().user && isAuthenticated().user.role === "admin" && (
            <div className="card mt-5">
              <div className="card-body">
                <h5 className="card-title">Admin</h5>
                <p className="mb-2 text-danger">Edit/Delete as an Admin</p>
                <Link
                  className="btn btn-raised btn-success mr-5"
                  to={`/profile/edit/${user._id}`}
                >
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    );
  }
}

export default Profile;
