import React, { Component } from "react";
import { isAuthenticated } from "../auth"; // eslint-disable-next-line
import { Redirect } from "react-router-dom";
import { read, update, updateUser } from "./apiUser";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      redirectToProfile: false,
      loading: false,
      fileSize: 0,
      about: "",
    };
  }
  init = (id) => {
    const token = isAuthenticated().token;
    read(id, token)
      .then((res) =>
        this.setState({
          id: res.data.id,
          about: "",
          name: res.data.name,
          email: res.data.email,
        })
      )
      .catch((err) => console.log(err));
  };
  componentDidMount() {
    this.userData = new FormData(); // browser api by default in chrome
    const userId = this.props.match.params.userId;
    this.init(userId);
  }
  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.userData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };
  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      update(userId, token, this.userData).then((data) => {
        if (data.error) {
          this.setState({ error: data.error });
        } else if (isAuthenticated().user.role === "admin") {
          //console.log(data._id,' admin')
          this.setState({
            id: data._id,
            redirectToProfile: true,
          });
        } else {
          updateUser(data, () => {
            //console.log('user',data._id)
            this.setState({
              id: data._id,
              redirectToProfile: true,
            });
          });
        }
      });
    }
  };
  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 1000000) {
      this.setState({
        error: "File size should be less than 100kb",
        loading: false,
      });
      return false;
    }
    if (name.length === 0) {
      this.setState({ error: "Name is required", loading: false });
      return false;
    }
    // eslint-disable-next-line
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({
        error: "A valid Email is required",
        loading: false,
      });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: "Password must be at least 6 characters long",
        loading: false,
      });
      return false;
    }
    return true;
  };
  toggle = () => {
    var temp = document.getElementById("materialRegisterFormPassword");
    if (temp.type === "password") {
      temp.type = "text";
    } else {
      temp.type = "password";
    }
  };

  render() {
    const { id, name, email, redirectToProfile, loading, about } = this.state;
    if (redirectToProfile) {
      return <Redirect push to={`/user/${id}`} />;
    }
    return (
      <div className="container" style={{ marginTop: "1vh", padding: "5vw" }}>
        <div className="card cloudy-knoxville-gradient">
          <h5 className="card-header info-color white-text text-center py-4">
            <strong>Edit Profile</strong>
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
                    autoComplete="username"
                    type="text"
                    required="required"
                    onChange={this.handleChange("name")}
                    value={name}
                    id="materialRegisterFormLastName"
                    className="form-control"
                  />
                  <label htmlFor="materialRegisterFormLastName">
                    Full Name
                  </label>
                </div>
              </div>
              <div className="form">
                <div className="md-form">
                  <input
                    autoComplete="email"
                    type="email"
                    required="required"
                    onChange={this.handleChange("email")}
                    value={email}
                    id="email"
                    className="form-control"
                  />
                  <label htmlFor="email">Email</label>
                </div>
              </div>
              <div className="md-form">
                <input
                  autoComplete="current-password"
                  type="password"
                  required="required"
                  onChange={this.handleChange("password")}
                  id="materialRegisterFormPassword"
                  className="form-control"
                  aria-describedby="materialRegisterFormPasswordHelpBlock"
                />
                <label htmlFor="materialRegisterFormPassword">Password</label>
                <button onClick={this.toggle}>Show Password</button>
                <small
                  id="materialRegisterFormPasswordHelpBlock"
                  className="form-text text-muted mb-4"
                >
                  Atleast 6 chars and 1 digit
                </small>
              </div>
              <div className="md-form">
                <textarea
                  onChange={this.handleChange("about")}
                  value={about}
                  id="materialContactFormMessage"
                  className="form-control md-textarea"
                  rows="3"
                ></textarea>
                <label htmlFor="materialContactFormMessage">About</label>
              </div>
              <button
                onClick={this.clickSubmit}
                className="btn btn-outline-info btn-rounded btn-block my-4 waves-effect z-depth-0"
                type="submit"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default EditProfile;
