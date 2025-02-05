const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const bcrypt = require("bcryptjs"); // for passwrord hash
const jwt = require("jsonwebtoken");
const crypto = require ('crypto')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    maxLength: [50, "The maximum number of characters is 50 characters"],
    minLength: [5, "The minimum number of characters is 5 characters"],
    trim: true,
    unique: true,
  },

  email: {
    type: String,
    required: [true, "A user must have a email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minLength: [8, "The minimum number of characters is 8 characters"],
    select: false,
  },
  confirmPassword: {
    type: String,
    // required: [true, "A user must have a confirm password"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords do not match",
    },
  },
  photo: {
    type: String,
    // default : 'default.jpg' ,
  },
  role:{
    type: String , 
    enum: ['user' , 'guide' , 'Lead-guide' , 'admin'] , 
    default : 'user'  
  } , 
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, // exclude this field from the output
  },
  passwordChangedAt : {
    type : Date , 
  }  , 
  passwordResetToken :{
    type : String
  }  , 
  passwordResetExpires : {
    type: Date
  }
});

userSchema.pre('save' , function (next){
  if (!this.isModified('password') || this.isNew) return next(); 
  this.passwordChangedAt = Date.now() - 1000;
  next() ;

})
userSchema.pre("save", async function (next) {
  // it run this function if only the password is modified
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12); // create a random slat with a complexity factor with 10
  this.password = await bcrypt.hash(this.password, salt);

  this.confirmPassword = undefined;

  next();
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

userSchema.methods.ComparePassword = async function (candidatePassword , userPassword){

    return await bcrypt.compare(candidatePassword , userPassword) ;
}

userSchema.methods.CheckPasswordChanged = function ( JWTTimestamp){

  // if this field exist then it might be changed it 
  if (this.passwordChangedAt){
    // i first convert the tpasswordChanged in ms and then divided by 1000 and parse the result 
    const changedTimestamp = Math.floor(new Date(this.passwordChangedAt).getTime() / 1000);
    return changedTimestamp > JWTTimestamp; 
  }

  // all correct then return false
  return false;

}

userSchema.methods.generatePasswordResetToken = function () {
  // genrate a random token and then convert 
  // code Explanation
  /*
        crypto.randomBytes(32).toString('hex')
      crypto.randomBytes(32): Generates a random buffer of 32 bytes.
      .toString('hex'): Converts the buffer into a hexadecimal string (a readable format).
      This token is used as a reset token that will be sent to the user.
      crypto.createHash('sha256').update(resetToken).digest('hex')

      crypto.createHash('sha256'): Creates a SHA-256 hash function.
      .update(resetToken): Takes the generated resetToken and feeds it into the hash function.
      .digest('hex'): Outputs the hash in hexadecimal format.
     -/// The purpose of this hashing is to store a hashed version of the token in the database for security reasons.
  */ 
  const resetToken = crypto.randomBytes(32).toString('hex') ;

  const HashedToken = crypto.createHash('sha256').update(resetToken).digest('hex'); 
  this.passwordResetToken = HashedToken ;
  this.passwordResetExpires = Date.now()+ 10*60*1000 ;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
