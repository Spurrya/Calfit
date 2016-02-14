module.exports = function(router, mongoose, auth, graph){


  router.get('/calendar', function(req, res){
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
          graph.getEvents(token, users,res);
        }, function (error) {
          console.error('>>> Error getting calendar events for users: ' + error);
        });
    }, function (error) {
      console.error('>>> Error getting access token: ' + error);
    });
  })

}
