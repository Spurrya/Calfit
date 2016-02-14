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
require('./routes/calendar')(router, mongoose, auth, graph);

app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);
