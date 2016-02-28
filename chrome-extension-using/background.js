// Returns a new notification ID used in the notification.
function getNotificationId() {
  var id = Math.floor(Math.random() * 9007199254740992) + 1;
  return id.toString();
}

function messageReceived(message) {
  // A message is an object with a data property that
  // consists of key-value pairs.

  // Pop up a notification to show the GCM message.
  chrome.notifications.create(getNotificationId(), {
    title: message.data.name,
    iconUrl: 'assets/img/'+ message.data.imgUrl+'/',
    type: 'basic',
    message: message.data.prompt,
    buttons : [
    { title: "Accept" },
    { title: "Reject" }
    ]
  }, function() {});
}

var registerWindowCreated = false;

function firstTimeRegistration() {
  chrome.storage.local.get("registered", function(result) {
    // If already registered, bail out.
    if (result["registered"])
      return;

    registerWindowCreated = true;
    chrome.app.window.create(
      "register.html",
      {  width: 500,
         height: 400,
         frame: 'chrome'
      },
      function(appWin) {}
    );
  });
}


// Event handlers for the various notification events
function notificationClosed(notification , byuser) {
  chrome.notifications.clear(notification, function() {

        console.log("Invite responded .");
      });
}

function notificationClicked(notification ) {

   chrome.notifications.clear(notification, function(wasCleared) {
        console.log("Invite responded .");
      });
}

function notificationBtnClick(notification, ibtn) {

  chrome.notifications.clear(notification, function(wasCleared) {
        console.log("Invite responded ."+ibtn);
  });

  if (ibtn=1) {

      chrome.storage.local.get(["email","username"],function(result){
          //call other users
          var name = result.username
          var email = result.email

          $.ajax({
               url: encodeURI('http://calfit.azurewebsites.net/api/accepted/' + email + '/'+ name),
               ajax:true,
               success: function(result)
               {
                 alert(result);
                 console.log(url)
               }
             });
      });
  }else {
    // do nothing :)
    console.log("Your invite has not been accepted .");
  }
}

chrome.gcm.onMessage.addListener(messageReceived);

// Set up listeners to trigger the first time registration.
chrome.runtime.onInstalled.addListener(firstTimeRegistration);
chrome.runtime.onStartup.addListener(firstTimeRegistration);

// notification event listener


chrome.notifications.onClosed.addListener(notificationClosed);
chrome.notifications.onClicked.addListener(notificationClicked);
chrome.notifications.onButtonClicked.addListener(notificationBtnClick);
