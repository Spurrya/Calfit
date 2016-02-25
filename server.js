//Author: Spurrya Jaggi
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var nodeInspector = require('node-inspector');
var config = require('./api/config');
var graph = require('./api/graph');
var auth = require('./api/auth');

var app = express();

mongoose.connect(config.hostedDatabase);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;
var router = express.Router();


require('./api/routes/index')(router, mongoose, auth);
require('./api/routes/calendar')(router, mongoose, auth, graph);
require('./api/routes/activities')(router, mongoose);
require('./api/routes/skype')(router, mongoose);


router.route('/login')
.post(function(req, res) {

  $.ajax({
       type: "GET",
       url: ' https://login.windows.net/common/oauth2/authorize',
       data: {response_type: 'code', client_id: config.clientId, resource:'https://outlook.office365.com/', state:generateUUID(), redirect_uri:'http://calfit.azurewebsites.net/login'},
       success: function(result)
       {
         alert('woohoo')
       }
     });
})


app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);


function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
