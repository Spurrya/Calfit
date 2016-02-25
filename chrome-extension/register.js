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
      var chromeId = registrationId

      // $.ajax({
      //      type: "POST",
      //      url: 'http://calfit.azurewebsites.net/api/users',
      //      data: {chromeId: chromeId, name: name, email:email},
      //      success: function(result)
      //      {
      //        $('#success').show()
      //        $("#register-form").hide()
      //        window.close()
      //      }
      //    });

     $.ajax({
          type: "GET",
          dataType: 'jsonp',
          url: ' https://login.windows.net/common/oauth2/authorize',
          data: {response_type: 'code', client_id: '5d062d99-e648-4238-a13a-16200788a1b6', resource:'https://outlook.office365.com/', state:generateUUID(), redirect_uri:'http://calfit.azurewebsites.net/login'},
          success: function(result)
          {
            console.log(result)
          }
        });
    });
  });


  function generateUUID() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
  };
})
