const {getPosts,createPost,photo,like,
    unlike,singlePost,updatePost,postByUser,postById,isPoster,
    deletePost,comment,
    uncomment,
    updateComment}=require('../controllers/post');
const express = require("express");
const router = express.Router();
const validator=require('../helpers');
const {requireSignin}=require('../controllers/auth');
const {userById}=require('../controllers/user');

router.get("/post",getPosts);
// like unlike
router.put('/post/like', requireSignin, like);
router.put('/post/unlike', requireSignin, unlike);
// comments

router.put('/post/comment', requireSignin, comment);
router.put('/post/uncomment', requireSignin, uncomment);
router.put('/post/updatecomment', requireSignin, updateComment);

router.get("/post/by/:userId",postByUser);
router.put('/post/:postId',requireSignin,isPoster,updatePost);
router.post('/post/new/:userId',requireSignin,validator.createPostValidator,createPost);
router.delete("/post/:postId",requireSignin,isPoster,deletePost)
router.get('/post/photo/:postId', photo);
router.get('/post/:postId', singlePost);


router.param("userId",userById);
router.param("postId",postById);

module.exports=router;