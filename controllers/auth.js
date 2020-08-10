const User = require("../model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const expressJwt = require("express-jwt");
const _ = require("lodash");
const { sendEmail } = require("../helpers");

exports.signup = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Fields are empty" });
  }
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(403).json({
      error: "Email is taken!",
    });
  }
  const user = new User(req.body);
  await user.save();
  res.status(200).json({ msg: "Signup success! login now", user });
};

exports.signin = (req, res) => {
  // find user on email base
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    // if error or no user
    if (err || !user) {
      return res.status(401).json({
        error: "User not exits. Please SignUp first",
      });
    }
    // if user, authenticate
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email Password does not matched",
      });
    }

    // gen token as t in cookie
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // persist the token as 't' in cookie
    res.cookie("t", token, { expire: new Date() + 9999 });
    // return res with user and token to frontend
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({ msg: "Signout Success" });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.socialLogin = (req, res) => {
  // try signup by finding user with req.email
  User.findOne({ email: req.body.email }, (err, user) => {
    console.log(req.profile);
    if (err || !user) {
      // create a new user and login

      user = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        photo: { url: req.body.photo },
      });
      // req.profile.photo.url = req.body.photo;
      // req.body.photo = undefined;
      user.save({ new: true }).then((usr) => {
        req.profile = usr;
        // generate a token with user id and secret
        const token = jwt.sign(
          { _id: usr._id, iss: "NODEAPI" },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        res.cookie("t", token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, name, email } = usr;
        return res.json({ token, user: { _id, name, email } });
      });
    } else {
      // update existing user with new social info and login
      user.photo.url = req.body.photo;
      req.body.photo = undefined;
      req.profile = user;
      user = _.extend(user, req.body);
      user.updated = Date.now();
      user.save();
      // generate a token with user id and secret
      const token = jwt.sign(
        { _id: user._id, iss: "NODEAPI" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.cookie("t", token, { expire: new Date() + 9999 });
      // return response with user and token to frontend client
      const { _id, name, email } = user;
      return res.json({ token, user: { _id, name, email } });
    }
  });
};
// add forgotPassword and resetPassword methods
exports.forgotPassword = (req, res) => {
  if (!req.body) return res.status(400).json({ message: "No request body" });
  if (!req.body.email)
    return res.status(400).json({ message: "No Email in request body" });

  //console.log("forgot password finding user with that email");
  const { email } = req.body;
  //console.log("signin req.body", email);
  // find the user based on email
  User.findOne({ email }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status("401").json({
        error: "User with that email does not exist!",
      });

    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, iss: "NODEAPI" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    // email data
    const emailData = {
      from: "noreply@readwrite.com",
      to: email,
      subject: "Password Reset Instructions",
      text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ message: err });
      } else {
        sendEmail(emailData);
        return res.status(200).json({
          message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
        });
      }
    });
  });
};

// to allow user to reset password
// first you will find the user in the database with user's resetPasswordLink
// user model's resetPasswordLink's value must match the token
// if the user's resetPasswordLink(token) matches the incoming req.body.resetPasswordLink(token)
// then we got the right user

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  User.findOne({ resetPasswordLink }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status("401").json({
        error: "Invalid Link!",
      });

    const updatedFields = {
      password: newPassword,
      resetPasswordLink: "",
    };

    user = _.extend(user, updatedFields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: "User Not Found",
        });
      }
      res.json({
        message: `Great! Now you can login with your new password.`,
      });
    });
  });
};
