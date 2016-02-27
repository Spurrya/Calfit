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
    iconUrl: 'assets/img/cat.jpg',
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
    setStatus("Notification Invite responded");
        console.log("Invite responded .");
      });
}

function notificationBtnClicked(notification, ibtn) {
  console.log(notification)
  console.log(ibtn)

  chrome.notifications.clear(notification, function(wasCleared) {
    // ibtn =0 (accept)
    // ibtn =1  (reject)
    });
  if (ibtn=0) {
    setStatus("1");

    chrome.storage.local.get("name", function(name){
      chrome.storage.local.get("email",function(email){
          //call other users
          $.ajax({
               type: "POST",
               url: 'http://calfit.azurewebsites.net/api/accepted/'+email+'/'+ name,
               ajax:true,
               success: function(result)
               {
               }
             });
      });
    })

  }else {
    //snooze
  }
}

// Set up a listener for GCM message event.
chrome.gcm.onMessage.addListener(messageReceived);

// Set up listeners to trigger the first time registration.
chrome.runtime.onInstalled.addListener(firstTimeRegistration);
chrome.runtime.onStartup.addListener(firstTimeRegistration);
chrome.notifications.onButtonClicked.addListener(notificationBtnClicked);
