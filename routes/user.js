const {allUsers,userById,userPhoto,hasAuthorization,addFollowing,findpeople,removeFollowing,removeFollower,addFollower,getUser,updateUser,deleteUser}=require('../controllers/user');
const express = require("express");
const router = express.Router();
const {requireSignin}=require('../controllers/auth');

router.get('/users',allUsers);
router.put('/user/follow',requireSignin,addFollowing,addFollower);
router.put('/user/unfollow',requireSignin,removeFollowing,removeFollower);
router.get('/user/:userId',requireSignin,getUser);
router.put('/user/:userId',requireSignin,hasAuthorization,updateUser);
router.delete('/user/:userId',requireSignin,hasAuthorization,deleteUser);
router.get('/user/findpeople/:userId',requireSignin,findpeople);
router.param("userId",userById);
router.get('/user/photo/:userId',userPhoto);
module.exports=router;