var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');
var bodyParser = require('body-parser');
var auth = require('./auth');
var graph = require('./graph');


var app = express();

mongoose.connect(config.hostedDatabase);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;
var router = express.Router();

require('./routes/index')(router, mongoose);

app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);


// Get an access token for the app.
auth.getAccessToken().then(function (token) {
  // Get all of the users in the tenant.
  graph.getUsers(token)
    .then(function (users) {
      // Create an event on each user's calendar.
      //Uncomment when you want to create a new event in the API
      //graph.createEvent(token, users);
    }, function (error) {
      console.error('>>> Error getting users: ' + error);
    }).then(function (users) {
      // Get calendar events for users
      graph.getEvents(token, users);
    }, function (error) {
      console.error('>>> Error getting calendar events for users: ' + error);
    });
}, function (error) {
  console.error('>>> Error getting access token: ' + error);
});
