// model for mongoose for what an user is
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// define model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// on save hook, encrypt password
// before saving model, run this function
userSchema.pre('save', function(next) {
  // get access to user model, an instance of the user model
  const user = this;

  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    // hash (encrypt) password using the salt
    bcrypt.hash(user.password, salt, null, function(err,hash){
      if (err) { return next(err); }
      // overwrite the plain text password with encrypted one
      user.password =  hash;
      // save model
      next();
    });
  });
});

// This is used in passport.js local strategy
userSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err) {return callback(err)}
    callback(null, isMatch);
  })
}

// create the model class
const ModelClass = mongoose.model('user', userSchema);

// export the model
module.exports = ModelClass;
