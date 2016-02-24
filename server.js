//Author: Spurrya Jaggi
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var nodeInspector = require('node-inspector');
var config = require('./api/config');
var request = require('request');
var Q = require('q');

var app = express();

mongoose.connect(config.hostedDatabase);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;
var router = express.Router();

var graph = require('./api/graph')(request, Q);
var auth = require('./api/auth')(request, Q,config);
require('./api/routes/index')(router, mongoose, auth);
require('./api/routes/calendar')(router, mongoose, auth, graph);
require('./api/routes/activities')(router, mongoose);
require('./api/routes/skype')(router, mongoose);

app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);
