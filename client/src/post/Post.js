import React, { Component } from "react";
import { isAuthenticated } from "../auth"; // eslint-disable-next-line
import { Redirect } from "react-router-dom";
import { create } from "./apiPost";
import CKEditor from "@ckeditor/ckeditor5-react";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";

class Post extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      body: "",
      photo: "",
      error: "",
      user: {},
      fileSize: 0,
      loading: false,
      redirect: false,
    };
  }
  componentDidMount() {
    this.postData = new FormData(); // browser api by default in chrome
    const user = isAuthenticated().user;
    this.setState({ user });
  }
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
    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      create(userId, token, this.postData).then((data) => {
        if (data.error) {
          this.setState({ error: data.error, loading: false });
        } else {
          this.setState({
            loading: false,
            redirect: "true",
            title: "",
            body: "",
            photo: "",
            error: "",
          });
        }
      });
    }
  };
  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (fileSize > 1000000) {
      this.setState({
        error: "File size should be less than 100kb",
        loading: false,
      });
      return false;
    }
    if (title.length >= 1 && body.length <= 5) {
      this.setState({
        error: "All fields must be at least 6 characters long",
        loading: false,
      });
      return false;
    }
    return true;
  };

  render() {
    const { loading, redirect, user } = this.state;
    if (redirect) {
      return <Redirect to={`/user/${user._id}`} />;
    }
    return (
      <div className="container" style={{ marginTop: "1vh", padding: "5vw" }}>
        <div className="card cloudy-knoxville-gradient">
          <h5 className="card-header info-color white-text text-center py-4">
            <strong>Create Post</strong>
          </h5>
          <div className="card-body px-lg-5 pt-0">
            {loading ? "Loading..." : null}
            <form
              onSubmit={this.clickSubmit}
              encType="multipart/form-data"
              className="text-center"
              style={{ color: "#757575" }}
            >
              <div className="form">
                <div className="md-form">
                  <input
                    type="file"
                    accept="image/*"
                    required="required"
                    onChange={this.handleChange("photo")}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="form">
                <div className="md-form">
                  <input
                    autoCapitalize="true"
                    autoComplete="post"
                    type="text"
                    required="required"
                    onChange={this.handleChange("title")}
                    id="materialRegisterFormLastName"
                    className="form-control"
                  />
                  <label htmlFor="materialRegisterFormLastName">Title </label>
                </div>
              </div>
              <div className="md-form">
                <CKEditor
                  onInit={(editor) => {
                    console.log("Editor is ready to use!", editor);
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
                    this.setState({ body: data });
                    //console.log(data);
                  }}
                  editor={DecoupledEditor}
                  data="<p>Create Your Content</p><br/><br/><br/><br/><br/><br/>"
                />
              </div>
              <button
                onClick={this.clickSubmit}
                className="btn btn-outline-info btn-rounded btn-block my-4 waves-effect z-depth-0"
                type="submit"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Post;
