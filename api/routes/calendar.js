module.exports = function(router, mongoose, auth, graph){

  var gcm = require('node-gcm');
  var config = require('../config')
  var moment = require('moment');
  var Activity = require('../models/activity');
  var User = require('../models/User')


  var sender = new gcm.Sender(config.gcm);
  var message = new gcm.Message();

  //This route creates a new calendar event for testing
  router.route('/calendar')
  .post(function(req, res) {
    // Get an access token for the app.
    auth.getAccessToken().then(function (token) {
      // Get all of the users in the tenant.
      graph.getUsers(token)
        .then(function (users) {
          // Create an event on each user's calendar.
          graph.createEvent(token, users);
        }, function (error) {
          console.error('>>> Error getting users: ' + error);
        })
    }, function (error) {
      console.error('>>> Error getting access token: ' + error);
    }
  );
  });

//This route provides all the timings of the upcoming events in the calendar.
  router.get('/calendar', function(req, res){
      // Get an access token for the app.
      auth.getAccessToken().then(function (token) {
        // Get all of the users in the tenant.
        graph.getUsers(token)
          .then(function (users) {
            // res.json({message: users})
            // Get calendar events for users
            graph.getEvents(token, users, res).then(function(data){

              Activity.find(function(err, activity) {

                //The number of entries for the collection will always remain 6.
                //Therefore, it is safe to get all the entries. However, this is
                //not recommended once we go above 30+ entries
                var activities = activity;

                if(canUserTakeBreak(data)==true){

                  var users = findUsers()
                  users.forEach(function(user){
                    graph.pushNotification(activities[Math.floor(Math.random() * activities.length)], user.chromeId)
                  })
                }
                else {
                  res.json({message:'no'})
                }
              });

            })

          }, function (error) {
            console.error('>>> Error getting calendar events for users: ' + error);
          });
      }, function (error) {
        console.error('>>> Error getting access token: ' + error);
      });
  });

var findUsers = function() {
  var user = User.find({email : 'bhaanu@yofit1.onmicrosoft.com'}, function(err,u){
    if (err)
        console.log(err);
    return u
  })
}

/*
  Returns a boolean value whether the user CAN take a break
  This depends on whether the user recently took a break or whether they have
  upcoming meetings
*/

function canUserTakeBreak(listOfEvents){
  var currentDate = moment().utc();

    for(var i =0; i<listOfEvents.length;i++){
        var start = moment(listOfEvents[i].start.dateTime).utc()
        var end  = moment(listOfEvents[i].end.dateTime).utc()

        var differenceBetweenStartAndCurrent = Math.abs(start.diff(currentDate, 'minutes'));

        //Only if the scheduled meeting is not
        if (moment(currentDate).isBetween(start, end) || differenceBetweenStartAndCurrent <= 20){
          //Add additional logic here!!
          return false;
        }
    }
    return true;
  }

  graph.pushNotification = function(response, chromeId){
    var message = new gcm.Message();
    message.addData({
      activity: response.activity,
      name: response.name,
    });
    sender.send(message, { registrationTokens: [chromeId] }, function (err, response) {
        if(err) console.error(err);
        else    console.log(response);
    });
  }
  module.exports = graph;

}
