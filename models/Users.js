//Author: Spurrya Jaggi

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Creating a user model which will take name, email and the
//chrome browser identification string
var usersSchema = new Schema({
  name: String,
  email : String,
  chromeId : String
});

var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
