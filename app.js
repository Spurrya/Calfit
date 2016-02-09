var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config.json');

var app = express();

mongoose.connect('mongodb://' + config.test)

//Including all the routes
require('./routes/index')(app, mongoose);


///Load all files in models dir
//Use `require()` whenever importing code
//var User = require('./models/user');

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
