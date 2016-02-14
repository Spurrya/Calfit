var express = require('express');
var mongoose = require('mongoose');
var config = require('./config.json');
var bodyParser = require('body-parser');
var authContext = require('adal-node').AuthenticationContext;
var request = require('ajax-request');
var authHelper = require('./authHelper.js');
var requestUtil = require('./requestUtil.js')
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');

var app = express();

mongoose.connect('mongodb://' + config.hostedDatabase)
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;
var router = express.Router();

require('./routes/index')(router, mongoose);
require('./routes/calendar')(router,mongoose, authHelper, requestUtil);


app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);
