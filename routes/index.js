module.exports = function(app, mongoose){
  var User = require('../models/User');
  //Home page
  app.get('/', function (req, res) {
    res.send('Hello World!');
  });

  //Get users
  app.get('/user', function(req, res) {
    User.find(function(err, users) {
      res.send(users);
    });
  });
};
