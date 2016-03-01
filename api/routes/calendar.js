module.exports = function(router, mongoose, auth, graph){

  var gcm = require('node-gcm');
  var config = require('../config')
  var moment = require('moment');
  var Activity = require('../models/activity');
  var User = require('../models/User')
  var graph = require('../graph')
  var request = require('request');
  


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

              Activity.find(function(err, activities) {

                //The number of entries for the collection will always remain 6.
                //Therefore, it is safe to get all the entries. However, this is
                //not recommended once we go above 30+ entries
                //var activities = activity;

                if(canUserTakeBreak(data)==true){
                  res.json({message:data})
                  //bhaanu@yofit1.onmicrosoft.com
                  User.find({email : req.params.emailId}, function(err,users){
                    if (err)
                        res.json({error:err});
                    else{
                      users.forEach(function(user, index){
                          var message = {}
                          var activity =  activities[Math.floor(Math.random() * activities.length)]
                          message.activity = activity.activity;
                          message.name = activity.name
                          message.imgUrl = activity.imgUrl
                          message.firstUser = 1;
                          var str = ""
                          message.prompt = str.concat("Hi, ", user.name , " ! " , activity.activity)
                          //this activity id will be sent back in the url so that we use same activity details in 
                          //calendar appointment details and informing others of type of activity
                          message.activityId = activity._id;
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

  router.get('/accepted/:emailId/:name/:activityId', function(req, res){
    
    // Get an access token for the app.
    auth.getAccessToken().then(function (token) {
      // Get all of the users in the tenant.
      graph.getUsers(token, req.params.emailId)
        .then(function (users) {
          console.error('>>>req.body.emailId='+req.params.emailId)
          //Get the relevant user first
          users.forEach(function(user, index){
            console.error('>>> Entered users.foreach mail='+user.mail);
            if(user.mail==req.params.emailId)
            {
              console.error('>>> matched mailid in foreach');              
              
              //getting activity details so that same will be set in calendar invite also
              Activity.findById(req.params.activityId,function(err, activityRec) {
              var event = fillEventDetails(req,activityRec);
              console.error('>>> event details: ' + event);
              createCalEvent(token,user,event);
              });

              
               
            }
            else
            {
              console.error('>>> did Not match mailid in foreach');
            }
          }); 
          
          // Get calendar events for users
          graph.getEvents(token, users, res).then(function(data){


            Activity.findById(req.params.activityId,function(err, activityRec) {

              console.error('>>> activity find call back activity='+activityRec);
              
              //The number of entries for the collection will always remain 6.
              //Therefore, it is safe to get all the entries. However, this is
              //not recommended once we go above 30+ entries
              //var activities = activity;

              if(canUserTakeBreak(data)==true){
                res.json({message:data})
                //bhaanu@yofit1.onmicrosoft.com
                User.find({email :{ $ne: req.params.emailId}}, function(err,users){
                  if (err)
                      res.json({error:err});
                  else{
                    users.forEach(function(user, index){
                        var message = {}
                        message.name = activityRec.name;
                        message.imgUrl = activityRec.imgUrl;
                        message.firstUser = 1;
                        var str = "";
                        message.prompt = str.concat("Hi, ", user.name , " ! " , "Join ", req.params.name, " for "+ activityRec.activity);
                        message.activityId = activityRec._id;
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

          });

        }, function (error) {
          console.error('>>> Error getting calendar events for users: ' + error);
        });
    }, function (error) {
      console.error('>>> Error getting access token: ' + error);
    });
  });

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
      prompt: response.prompt,
      imgUrl:response.imgUrl,
      activityId:response.activityId
    });
    sender.send(message, { registrationTokens: [chromeId] }, function (err, response) {
        if(err) console.error(err);
    });
  };
  
// @name fillEventDetails
// @desc Creates an event variable and fills necessary data
// @param req rest api request with all necessary parameters  
function fillEventDetails(req,activityRec) {
    console.error('>>> Fill event details entered ');
    // The new event will be 10 minutes and take place today at the current time.
    var startTime = new Date();
    startTime.setDate(startTime.getDate());
    var endTime = new Date(startTime.getTime() + 10 * 60000);
    // we are using todays date . 

      // These are the fields of the new calendar event.
    var newEvent = {
      Subject: "Break: "+activityRec.activity,
      Location: {
        DisplayName: "Healthy Land ;-)"
      },
      Start: {
        'DateTime': startTime,
        'TimeZone': 'PST'
      },
      End: {
        'DateTime': endTime,
        'TimeZone': 'PST'
      },
      "ShowAs":"Oof",
      Body: {
        Content: '<html> <head></head> <body><p>'+activityRec.name+' '+activityRec.activity +'</p>' +'<img src="http://thumbs.dreamstime.com/z/business-man-suit-walking-beach-13321410.jpg" height="70" width="42" </body> </html>',
        ContentType: 'HTML'
      }
    };
    
    return newEvent;

}

// @name createEvent
// @desc Creates an event on a user's calendar.
// @param token The app's access token.
// @param user An user in the tenant.
function createCalEvent(token, user,newEvent) {
   console.error('>>> Entered createCalEvent function');

    // Add an event to the current user's calendar.
    request.post({
      url: 'https://graph.microsoft.com/v1.0/users/' + user.id + '/events',
      headers: {
        'content-type': 'application/json',
        'authorization': 'Bearer ' + token,
        'displayName': user.displayName
      },
      body: JSON.stringify(newEvent)
    }, function (err, response, body) {
      console.error('>>> Entered callback of Pst to graph');
      if (err) {
        console.error('>>> Application error: ' + err);
      } else {
        var parsedBody = JSON.parse(body);
        var displayName = response.request.headers.displayName;

        if (parsedBody.error) {
          if (parsedBody.error.code === 'RequestBroker-ParseUri') {
            console.error('>>> Error creating an event for ' + displayName  + '. Most likely due to this user having a MSA instead of an Office 365 account.');
          } else {
            console.error('>>> Error creating an event for ' + displayName  + '.' + parsedBody.error.message);
          }
        } else {
          console.log('>>> Successfully created an event on ' + displayName + "'s calendar.");
          console.error('>>> Successfully created an event on ' + displayName + "'s calendar.");
        }
      }
    });

}; 


  
  module.exports = graph;

};
