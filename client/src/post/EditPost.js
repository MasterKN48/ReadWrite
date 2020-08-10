import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import Logo from "../core/Logo.png";
import CKEditor from "@ckeditor/ckeditor5-react";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";

class EditPost extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      title: "",
      body: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false,
    };
  }

  init = (postId) => {
    singlePost(postId).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data.postedBy._id,
          title: data.title,
          body: data.body,
          error: "",
        });
      }
    });
  };

  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId);
  }

  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (fileSize > 1000000) {
      console.log(fileSize);
      this.setState({
        error: "File size should be less than 100kb",
        loading: false,
      });
      return false;
    }
    if (title.length === 0 || body.length === 0) {
      this.setState({ error: "All fields are required", loading: false });
      return false;
    }
    return true;
  };

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.postData.append(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    //console.log(this.postData.get("body"));
    if (this.isValid()) {
      const postId = this.props.match.params.postId;
      const token = isAuthenticated().token;

      update(postId, token, this.postData)
        .then((data) => {
          this.setState({
            loading: false,
            redirectToProfile: true,
            title: "",
            body: "",
            photo: "",
            error: "",
          });
        })
        .catch((err) => {
          this.setState({ error: err.error, loading: false });
        });
    }
  };

  editPostForm = (title, body) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Post Photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          onChange={this.handleChange("title")}
          type="text"
          className="form-control"
          value={title}
        />
      </div>
      <div className="md-form">
        <CKEditor
          onInit={(editor) => {
            //console.log("Editor is ready to use!", editor);
            // Insert the toolbar before the editable area.
            editor.ui
              .getEditableElement()
              .parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
              );
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            this.postData.append("body", data);
            //console.log(data);
            this.setState({ body: data });
          }}
          editor={DecoupledEditor}
          data={body}
        />
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Update Post
      </button>
    </form>
  );

  render() {
    const { id, title, body, redirectToProfile, error, loading } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    }

    return (
      <div className="container">
        <div className="m-4">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>

          {loading ? (
            <div align="center" className="ui segment">
              <div className="ui active inverted dimmer">
                <div className="ui text loader">Loading</div>
              </div>
              <p></p>
            </div>
          ) : (
            ""
          )}

          <img
            style={{ height: "200px", width: "auto" }}
            className="img-thumbnail"
            src={`/api/post/photo/${this.props.match.params.postId}`}
            onError={(i) => (i.target.src = `${Logo}`)}
            alt={title}
          />
          {isAuthenticated().user._id === id && this.editPostForm(title, body)}
        </div>
      </div>
    );
  }
}

export default EditPost;
