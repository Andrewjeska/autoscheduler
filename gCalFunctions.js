


function getAuthToken(callback){
    //options contains whether we promt the user (interactive) and a callback functions
    chrome.identity.getAuthToken({ 'interactive': false}, function(token) {
        console.log("auth");
        if(token == null){
            chrome.identity.getAuthToken({ 'interactive': true}, callback);
        } else {
            callback(token)
        }

    });
}

//creates the user's calendar

function createCalendar(name, token, callback) {
  console.log("In createCalendar()");

    // POST request to create a new calendar
    var url = "https://www.googleapis.com/calendar/v3/calendars";
    var params = {
      "summary": name,
      "timeZone": "America/New_York"
    };
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    //Send the proper header information along with the request
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            var newCalId = (JSON.parse(xhr.responseText).id);

            callback(newCalId);

          } else {
            console.log("Error", xhr.statusText);
          }
        }
    }

    xhr.send(JSON.stringify(params));

}

// get user's already scheduled events from the calendar, from the next week

function getPermanentEvents(token, callback){

    var currentTime = new moment();

    var url = "https://www.googleapis.com/calendar/v3/calendars/primary/events?";
    url += "orderBy=startTime&";
    url += "singleEvents=true&";
    url += "timeMin=" + currentTime.toDate().toISOString() + "&";
    url += "timeMax=" + currentTime.add(7, 'd').toDate().toISOString();

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    //Send the proper header information along with the request
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            var newCalId = (JSON.parse(xhr.responseText).id);
            //pagecodediv.innerText = 'Importing your schedule...';
            //document.querySelector('#import-button').remove();
            //importEvents(newCalId, token, events);
            console.log("getPermanentEvents returned: " + JSON.parse(xhr.response));
            permaEvents = []
            console.log(JSON.parse(xhr.responseText).items);

            for(var i = 0; i < JSON.parse(xhr.responseText).items.length; i++){
                var item = JSON.parse(xhr.responseText).items[i];
                console.log(item);

                var seconds = moment(item.end.dateTime).unix() - moment(item.start.dateTime).unix();
                console.log(seconds);
                var halfhours = Math.ceil(seconds / 60 / 30)

                var event = {
                    "taskName": item.summary,
                    "dueDate": moment(item.start.dateTime).unix(), //unix time
                    "duration": halfhours, //half hours
                    "preference": 0
                }
                permaEvents.push(event);
            }
            console.log("perma: " + permaEvents);
            callback(permaEvents);

          } else {
            console.log("Error", xhr.statusText);
            //pagecodediv.innerText = 'Uh Oh! Something went wrong...Sorry about the inconvenience! Feel free to shoot tchen112@terpmail.umd.edu an email so we know we\'re down!';
            //document.querySelector('#import-button').remove();
          }
        }
    }

    xhr.send();

}

//schedule events per task
function createEvents(calId = 'primary', token, events, taskName, callback) {

    //TODO: Figure out what data constitutes an event
    //TODO: schedule events in a batch?
    console.log(calId);
    console.log(taskName);

    events.forEach(function(e){

        console.log(e);
        console.log(moment.unix(e.From).utc().toISOString());
        console.log(moment.unix(e.To).utc().toISOString());

        var url = "https://www.googleapis.com/calendar/v3/calendars/" + calId + "/events";


        var params = {
            "summary": taskName,
            "description":taskName,


            //using description for importance score
            //'description': e.preference,

            'start': {
                'dateTime': moment.unix(e.From).utc().toDate().toISOString(),
                'timeZone': 'America/New_York'
            },
            'end': {
                'dateTime': moment.unix(e.To).utc().toDate().toISOString(),
                'timeZone': 'America/New_York'
            }

        };


        var xhr = new XMLHttpRequest();
         xhr.open("POST", url, true);

         //Send the proper header information along with the request
         xhr.setRequestHeader('Content-Type', 'application/json');
         xhr.setRequestHeader('Authorization', 'Bearer ' + token);


         xhr.onreadystatechange = function() {
             if (xhr.readyState == XMLHttpRequest.DONE) {
                 // console.log(JSON.parse(xhr.responseText));
                 callback(xhr.response);
             }
         }

         xhr.send(JSON.stringify(params));
	});


}
