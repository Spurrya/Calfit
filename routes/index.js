module.exports = function(app, mongoose){

  //Home page
  app.get('/', function (req, res) {
    res.send('Hello World!');
  });

  //Get users
  app.get('/user', function(req, res) {
    mongoose.model('user').find(function(err, users) {
      res.send(users);
    });
  });
};
