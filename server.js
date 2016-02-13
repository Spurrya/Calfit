var express = require('express');
var mongoose = require('mongoose');
var config = require('./config.json');
var bodyParser = require('body-parser');
var app = express();
mongoose.connect('mongodb://user1:user1@ds059145.mongolab.com:59145/yofitdb')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var router = express.Router();

//Including all the routes
require('./routes/index')(router, mongoose);


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
