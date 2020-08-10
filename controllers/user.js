const User = require("../model/User");
const Post = require("../model/Post");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");
exports.userById = (req, res, next, id) => {
  User.findById(id)
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      req.profile = user; // adds profile in object in req
      next();
    });
};
exports.userName = (req, res) => {
  let data = req.profile.name;
  return res.json(data);
};

exports.hasAuthorization = (req, res, next) => {
  let sameUser = req.profile && req.auth && req.profile._id == req.auth._id;
  let adminUser = req.profile && req.auth && req.auth.role === "admin";
  const authorized = sameUser || adminUser;
  if (!authorized) {
    return res.status(403).json({
      error: "User not authorized",
    });
  }
  next();
};

exports.allUsers = (req, res) => {
  User.find((err, users) => {
    if (err) return res.status(400).json({ error: err });

    return res.json({ users });
  }).select("_id name email updated created");
};

exports.getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.userPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set(("Content-Type", req.profile.photo.contentType));
    return res.send(req.profile.photo.data);
  }
  if (req.profile.photo.url) {
    return res.send(req.profile.photo.url);
  }
  next();
};

exports.updateUser = (req, res, next) => {
  let form = new formidable.IncomingForm();
  // console.log("incoming form data: ", form);
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    // save user
    let user = req.profile;
    // console.log("user in update: ", user);
    user = _.extend(user, fields);

    user.updated = Date.now();
    // console.log("USER FORM DATA UPDATE: ", user);

    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      // console.log("user after update with formdata: ", user);
      res.json(user);
    });
  });
};

exports.deleteUser = (req, res) => {
  let user = req.profile;
  user.remove((err, user) => {
    if (err) {
      res.status(400).json({
        error: err,
      });
    }
    let id = user._id;
    Post.findByIdAndDelete({ postedBy: id })
      .then((post) => {
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({ msg: "User and Its post  Deleted!" });
      })
      .catch((err) =>
        res.json({ msg: "failed to delete posts of user but user deleted" })
      );
  });
};

exports.addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $push: { following: req.body.followId } },
    (err, result) => {
      if (err) return res.status(400).json({ error: err });
      next();
    }
  );
};

exports.removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $pull: { following: req.body.unfollowId } },
    (err, result) => {
      if (err) return res.status(400).json({ error: err });
      next();
    }
  );
};

exports.addFollower = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: req.body.userId } },
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, result) => {
      if (err)
        return res.status(400).json({
          error: err,
        });
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};

exports.removeFollower = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    { $pull: { followers: req.body.userId } },
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, result) => {
      if (err)
        return res.status(400).json({
          error: err,
        });
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};

exports.findpeople = (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id); // current user
  User.find({ _id: { $nin: following } }, (err, users) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(users);
  }).select("_id name"); //$nin not included
};
