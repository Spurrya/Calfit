function register(callback) {
  var senderId = '597929500512';
  chrome.gcm.register([senderId], function (regId) {
      if (chrome.runtime.lastError) {
        return false;
      }
      chrome.storage.local.set({registered: true});
      callback(regId);
  });
}

$(function(){

  $("#register-form").submit(function(e) {
    //Disable from further calls
    $('#submit').disabled = true;
    register(function (registrationId) {
      var name = $('#name').val()
      var email = $('#email').val()
      //Insert console.log or alert here to slow it down
      var chromeId = registrationId

      $.ajax({
           type: "POST",
           url: 'http://calfit.azurewebsites.net/api/users',
           ajax:false,
           data: {chromeId: chromeId, name: name, email:email},
           success: function(result)
           {
           }
         });
    });
