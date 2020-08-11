import React, { useState } from "react"; // eslint-disable-next-line
import { Link } from "react-router-dom";
//import {signup} from './apiAuth';
import axios from "axios";
const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });
  const { name, email, password, error, success } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };
  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    const user = {
      name,
      email,
      password,
    };
    //console.log(user);
    axios
      .post("/api/signup", user)
      .then((res) => {
        setValues({
          name: "",
          email: "",
          password: "",
          error: false,
          success: true,
        });
      })
      .catch((err) => {
        setValues({
          ...values,
          error: err.response.data.error,
          success: false,
        });
        console.log(err.response.data);
      });
  };
  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );
  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      New account is created. Please <Link to="/login">Signin</Link>
    </div>
  );
  return (
    <div className="container" style={{ marginTop: "1vh", padding: "5vw" }}>
      <div className="container w-75 w-sm-100">
        <div className="card cloudy-knoxville-gradient">
          <h4 className="card-header info-color white-text text-center py-4">
            <strong>Sign up</strong>
          </h4>
          {showError()}
          {showSuccess()}
          <div className="card-body px-lg-5 pt-0">
            <form
              onSubmit={clickSubmit}
              className="text-center"
              style={{ color: "#757575" }}
            >
              <div className="form">
                <div className="md-form">
                  <input
                    type="text"
                    required="required"
                    onChange={handleChange("name")}
                    value={name}
                    id="materialRegisterFormLastName"
                    className="form-control"
                  />
                  <label htmlFor="materialRegisterFormLastName">
                    Full Name
                  </label>
                </div>
              </div>
              <div className="md-form mt-0">
                <input
                  type="email"
                  required
                  onChange={handleChange("email")}
                  value={email}
                  id="materialRegisterFormEmail"
                  className="form-control"
                />
                <label htmlFor="materialRegisterFormEmail">E-mail</label>
              </div>
              <div className="md-form">
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={handleChange("password")}
                  value={password}
                  id="materialRegisterFormPassword"
                  className="form-control"
                  aria-describedby="materialRegisterFormPasswordHelpBlock"
                />
                <label htmlFor="materialRegisterFormPassword">Password</label>
                <small
                  id="materialRegisterFormPasswordHelpBlock"
                  className="form-text text-muted mb-4"
                >
                  At least 8 characters and 1 digit
                </small>
              </div>

              <button
                onClick={clickSubmit}
                className="btn btn-outline-info btn-rounded btn-block my-4 waves-effect z-depth-0"
                type="submit"
              >
                Sign up
              </button>
              <hr />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
