module.exports = function(router, mongoose, auth, graph){

  var gcm = require('node-gcm');
  var config = require('../config')
  var moment = require('moment');
  var Activity = require('../models/activity');
  var User = require('../models/User')
  var graph = require('../graph')


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
  router.get('/calendar/:emailId', function(req, res){
      // Get an access token for the app.
      auth.getAccessToken().then(function (token) {
        // Get all of the users in the tenant.
        graph.getUserByEmail(token, req.params.emailId)
          .then(function (users) {

            // Get calendar events for users
            graph.getEvents(token, users, res).then(function(data){

              Activity.find(function(err, activity) {

                //The number of entries for the collection will always remain 6.
                //Therefore, it is safe to get all the entries. However, this is
                //not recommended once we go above 30+ entries
                var activities = activity;

                if(canUserTakeBreak(data)==true){
                  res.json({message:data})
                  //bhaanu@yofit1.onmicrosoft.com
                  User.find({email : req.params.emailId}, function(err,users){
                    if (err)
                        res.json({error:err});
                    else{
                      users.forEach(function(user, index){
                          var message = {}
                          activity =  activities[Math.floor(Math.random() * activities.length)]
                          message.activity = activity.activity;
                          message.name = activity.name
                          message.imgUrl = activity.imgUrl
                          message.firstUser = 1;
                          var str = ""
                          message.prompt = str.concat("Hi, ", user.name , " ! " , activity.activity)
                          console.log(message)
                          graph.pushNotification(message, user.chromeId)
                    })
                  }
                });
                }
                else {
                  res.json({message:data})
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

  router.get('/accepted/:emailId/:name', function(req, res){
    // Get an access token for the app.
    auth.getAccessToken().then(function (token) {
      // Get all of the users in the tenant.
      graph.getUsers(token, req.params.emailId)
        .then(function (users) {
          // Get calendar events for users
          graph.getEvents(token, users, res).then(function(data){

            Activity.find(function(err, activity) {

              //The number of entries for the collection will always remain 6.
              //Therefore, it is safe to get all the entries. However, this is
              //not recommended once we go above 30+ entries
              var activities = activity;

              if(canUserTakeBreak(data)==true){
                res.json({message:data})
                //bhaanu@yofit1.onmicrosoft.com
                User.find({email :{ $ne: req.params.emailId}}, function(err,users){
                  if (err)
                      res.json({error:err});
                  else{
                    users.forEach(function(user, index){
                        var message = {}
                        activity =  activities[Math.floor(Math.random() * activities.length)]
                        message.activity = activity.activity;
                        message.name = activity.name
                        message.imgUrl = activity.imgUrl
                        message.firstUser = 1;
                        var str = ""
                        message.prompt = str.concat("Hi, ", user.name , " ! " , "Join", decodeURI(req.params.name), "for a fun break activity!")
                        console.log(message)
                        graph.pushNotification(message, user.chromeId)
                  })
                }
              });
              }
              else {
                res.json({message:data})
              }
            });

          })

        }, function (error) {
          console.error('>>> Error getting calendar events for users: ' + error);
        });
    }, function (error) {
      console.error('>>> Error getting access token: ' + error);
    });
  })

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
          console.log(differenceBetweenStartAndCurrent);
          //FOR NOW
          return true;
        }
    }
    return true;
  }

  graph.pushNotification = function(response, chromeId){
    var message = new gcm.Message();
    message.addData({
      activity: response.activity,
      name: response.name,
      prompt: response.prompt
    });
    sender.send(message, { registrationTokens: [chromeId] }, function (err, response) {
        if(err) console.error(err);
    });
  }
  module.exports = graph;

}
