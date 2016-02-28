//Author: Spurrya Jaggi

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Creating a activity model which will take name (such as strech your inner cat)
//and related activity workout
var activitySchema = new Schema({
  id: Number,
  name: String,
  activity : String,
  imgUrl: String
});

var Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
