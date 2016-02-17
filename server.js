//Author: Spurrya Jaggi
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./api/config');
var auth = require('./api/auth');
var graph = require('./api/graph');
var app = express();

mongoose.connect(config.hostedDatabase);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;
var router = express.Router();

require('./api/routes/index')(router, mongoose);
require('./api/routes/calendar')(router, mongoose, auth, graph);
require('./api/routes/activities')(router, mongoose);
require('./api/routes/skype')(router, mongoose);

app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);
