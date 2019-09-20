const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required:"Name is required",
    },
    email:{
        type:String,
        required: "Email is required",
    },
    hashed_password:{
        type: String,
        required:true
    },
    about:{
        type:String,
        trim:true,
    },
    photo:{
        data:Buffer,
        contentType:String,
        url:{
            type:String,
            default:undefined
        }
    },
    following:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }],
    followers:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }],
    salt:String,
    created:{
        type:Date,
        default:Date.now
    },
    resetPasswordLink: {
        data: String,
        default: ""
    },
    role:{
        type:String,
        default: 'subscriber'
    },
    updated:Date
});


// virtual fields
const uuid=require('uuid');
const crypto=require('crypto');
userSchema.virtual('password')
.set(function(password){
    // create temp
    this._password=password
    // gen a timestamp
    this.salt=uuid()
    // encrypt password
    this.hashed_password=this.encryptPassword(password)
})
.get(function(){
    return this._password
})

// virtual methods
userSchema.methods={
    authenticate:function(text){
        return this.encryptPassword(text)=== this.hashed_password
    },
    encryptPassword: function(password) {
        if(!password) return "";
        try{
            const hash=crypto.createHmac('sha256',this.salt)
            .update(password)
            .digest('hex');
            return hash
        }catch(err){
            return ""
        }
    }
}


module.exports=mongoose.model("User", userSchema);
