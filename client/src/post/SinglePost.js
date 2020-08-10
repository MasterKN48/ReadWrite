import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Comment from "./Comment";
import Share from "./Share";
import Logo from "../core/Logo.png";
class SinglePost extends Component {
  state = {
    post: "",
    redirectToHome: false,
    redirectToSignin: false,
    like: false,
    likes: 0,
    comments: [],
  };
  checkLike = (likes) => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };
  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId)
      .then((data) => {
        this.setState({
          post: data,
          likes: data.likes.length,
          comments: data.comments,
          like: this.checkLike(data.likes),
        });
      })
      .catch((err) => console.log(err));
  };
  updateComments = (comments) => {
    this.setState({ comments });
  };

  likeToggle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectToSignin: true });
      return false;
    }
    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;

    callApi(userId, token, postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length,
        });
      }
    });
  };
  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete your post?");
    if (answer) {
      this.deletePost();
    }
  };
  renderPost = (post) => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : " Unknown";
    const { like, likes } = this.state;
    return (
      <div className="card-body mb-5">
        <Link to={`/`} className="btn btn-raised btn-link btn-md">
          Back to posts
        </Link>
        <h2>{post.title}</h2>
        <img
          src={`/api/post/photo/${post._id}`}
          alt={post.title}
          onError={(i) => (i.target.src = `${Logo}`)}
          className="img-fluid mb-3"
          style={{
            height: "300px",
            width: "100%",
            objectFit: "cover",
            backgroundColor: "#0E2F56",
          }}
        />
        {like ? (
          <h3 onClick={this.likeToggle}>
            <i
              className="thumbs up outline icon text-success"
              style={{ padding: "10px", borderRadius: "50%" }}
            />{" "}
            {likes} Like
          </h3>
        ) : (
          <h3 onClick={this.likeToggle}>
            <i
              className="thumbs up outline icon text-warning"
              style={{ padding: "10px", borderRadius: "50%" }}
            />{" "}
            {likes} Like
          </h3>
        )}
        <Share title={post.title} />
        <hr />
        <div
          className="container"
          dangerouslySetInnerHTML={{ __html: post.body }}
        ></div>
        <br />
        <p className="font-italic mark">
          Posted by <Link to={`${posterId}`}>{posterName} </Link>
          on {new Date(post.created).toDateString()}
        </p>
        {isAuthenticated().user &&
          isAuthenticated().user._id === post.postedBy._id && (
            <div>
              <Link
                to={`/posts/edit/${post._id}`}
                className="btn btn-raised btn-info btn-md"
              >
                Update Post
              </Link>
              <button
                onClick={this.deleteConfirmed}
                className="btn btn-raised btn-md btn-danger"
              >
                Delete Post
              </button>
            </div>
          )}
        <div>
          {isAuthenticated().user && isAuthenticated().user.role === "admin" && (
            <div className="card mt-5">
              <div className="card-body">
                <h5 className="card-title">Admin</h5>
                <p className="mb-2 text-danger">Edit/Delete as an Admin</p>
                <Link
                  to={`/posts/edit/${post._id}`}
                  className="btn btn-raised btn-warning btn-sm mr-5"
                >
                  Update Post
                </Link>
                <button
                  onClick={this.deleteConfirmed}
                  className="btn btn-raised btn-danger"
                >
                  Delete Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  render() {
    const { post, redirectToHome, redirectToSignin, comments } = this.state;
    if (redirectToHome) {
      return <Redirect to={`/`} />;
    } else if (redirectToSignin) {
      return <Redirect to={`/login`} />;
    }
    return (
      <div className="container mt-5 mb-5">
        {!post ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderPost(post)
        )}
        <Comment
          postId={post._id}
          comments={comments.reverse()}
          updateComments={this.updateComments}
        />
      </div>
    );
  }
}

export default SinglePost;
