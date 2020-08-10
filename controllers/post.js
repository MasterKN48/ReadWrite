const Post = require("../model/Post");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");
const getPosts = async (req, res) => {
  // get current page from req.query or use default value of 1
  const currentPage = req.query.page || 1;
  // return 3 posts per page
  const perPage = 6;
  let totalItems;
  const posts = await Post.find()
    // countDocuments() gives you total count of posts
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .populate("comments", "text created")
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .sort({ created: -1 })
        .limit(perPage)
        .select("_id title body likes created");
    })
    .then((post) => {
      res.status(200).json({ post });
    })
    .catch((err) => console.log(err));
};

const like = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    } else {
      res.json(result);
    }
  });
};

const unlike = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    } else {
      res.json(result);
    }
  });
};
const createPost = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; // allow to keep extn of file
  form.parse(req, (err, fields, files) => {
    // files fields are like req.body
    if (err) return res.status(400).json({ error: "Image could not uploaded" });

    let post = new Post(fields);
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    post.postedBy = req.profile;
    if (files.photo) {
      // photo is name of filed in frontend
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    post.save((err, result) => {
      if (err) return res.status(400).json({ error: err });
      res.json(result);
    });
  });
};
const photo = (req, res) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

const singlePost = (req, res) => {
  return res.json(req.post);
};

const postByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id name")
    .sort("_created")
    .exec((err, result) => {
      if (err) return res.status(400).json({ error: err });
      res.json({ result });
    });
};

const postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name role")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({
          error: err,
        });
      }
      req.post = post;
      next();
    });
};

const isPoster = (req, res, next) => {
  let sameUser = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  let adminUser = req.post && req.auth && req.auth.role === "admin";
  //console.log("req.post", req.post, "req.auth: ", req.auth);
  let isPoster = sameUser || adminUser;
  //console.log(req.post.postedBy._id==req.auth._id);
  if (!isPoster) {
    return res.status(403).json({
      error: "Unauthorized to delete",
    });
  }
  next();
};

const deletePost = (req, res) => {
  let post = req.post;
  post.remove((err) => {
    if (err) return res.status(400).json({ error: err });
    res.json({ msg: "Deleted Post!" });
  });
};

const updatePost = (req, res) => {
  let postId = req.params.postId;
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; // allow to keep extn of file
  form.parse(req, (err, fields, files) => {
    //console.log(fields);
    let myObj = {};
    if (fields.body) {
      myObj.body = fields.body;
    }
    if (fields.title) {
      myObj.title = fields.title;
    }
    if (files.photo) {
      // photo is name of filed in frontend
      let data = fs.readFileSync(files.photo.path);
      let contentType = files.photo.type;
      Post.findOneAndUpdate(
        { _id: postId },
        { ...myObj, photo: { data, contentType } },
        { new: true }
      )
        .then((post) => {
          return res.json(post);
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json({ error: "failed to update post" });
        });
    } else {
      Post.findOneAndUpdate({ _id: postId }, { ...myObj }, { new: true })
        .then((post) => {
          return res.json(post);
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json({ error: "failed to update post" });
        });
    }
  });
};
const comment = (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId;

  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      } else {
        res.json(result);
      }
    });
};

const uncomment = (req, res) => {
  let comment = req.body.comment;

  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { comments: { _id: comment._id } } },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      } else {
        res.json(result);
      }
    });
};

const updateComment = (req, res) => {
  let comment = req.body.comment;

  Post.findByIdAndUpdate(req.body.postId, {
    $pull: { comments: { _id: comment._id } },
  }).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    } else {
      Post.findByIdAndUpdate(
        req.body.postId,
        { $push: { comments: comment, updated: new Date() } },
        { new: true }
      )
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
          if (err) {
            return res.status(400).json({
              error: err,
            });
          } else {
            res.json(result);
          }
        });
    }
  });
};

module.exports = {
  getPosts,
  createPost,
  postByUser,
  postById,
  isPoster,
  deletePost,
  updatePost,
  singlePost,
  photo,
  like,
  unlike,
  comment,
  uncomment,
  updateComment,
};
