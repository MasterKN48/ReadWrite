const {signup,signin,signout,socialLogin,forgotPassword,
    resetPassword}=require('../controllers/auth');
const express = require("express");
const router = express.Router();
const {signupValidator,passwordResetValidator}=require('../helpers');
const {userById}=require('../controllers/user');

router.post('/signup',signup);
router.post('/signin',signin);
router.get('/signout',signout);
router.post("/social-login", socialLogin); 

// password forgot and reset routes
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);


router.param("userId",userById);

module.exports=router;