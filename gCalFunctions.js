let CLIENT_ID = '979538021176-j6orr3438e1ntr1cnma4rtcjb11qbehp.apps.googleusercontent.com';

let SCOPES = ["https://www.googleapis.com/auth/calendar"];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  console.log("checkAuth()");
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, authResponseHandler);
}


function authResponseHandler(result){
	if (authResult && !authResult.error) {
    		console.log("AUTHORIZED");

    		// remake the user's calendar
    		newCalId = gapi.client.load('calendar', 'v3', createCalendar);
    		console.log("newCalId: " + newCalId);

  	} else {  // reauth requires
    		console.log("NOT AUTHORIZED");
  	}

}

//creates the user's calendar

function createCalendar(name) {
  console.log("In createCalendar()");
  var request = gapi.client.calendar.calendars.insert({
    'summary': name,
    'timezone': 'America/New_York'
  });

  console.log("All calendars: " + gapi.client.calendar.calendars);

  request.execute(function(resp) {
    console.log(resp);
    newCalId = resp.id  // global scope to hack around nonaccessible return value
    return(newCalId);   // return newly created GCal ID
  });

  console.log("Executed request in createCalendar()");
}

// get user's already scheduled events from the calendar, from the next week

function getPermanentEvents(){

    var currentTime = new Date();

    var request = gapi.client.calendar.events.list({

        //assuming only the primary calendar, but in practice we want everything

        'calendarId': 'primary',
        'timeMin': (currentTime).toISOString(),
        'timeMax': moment(currentTime).add(7, 'd').toDate().toISOString(),
        'singleEvents': true,
        'orderBy': 'startTime'
    });

    request.execute(function(res) {
        return(resp.items);

    });

    console.log('retrieved permanent events');

}


function createEvents(calId, events) {

    //TODO: Figure out what data constitutes an event

    events.forEach(function(e){

        var event = {
            'summary': e.name,
            'id': e.id,

            //using description for importance score
            'description': e.importance,

            'start': {
                'dateTime': e.startTime,
                'timeZone': 'America/New_York'
            },
            'end': {
                'dateTime': 'e.endTime',
                'timeZone': 'America/New_York'
            }

        };


        var request = gapi.client.calendar.events.insert({
            'calendarId': calId,
            'resource': event
        });


        request.execute(function(event) {
            console.log("Inserted event with id: " + event.id);
        });
	})	


}
