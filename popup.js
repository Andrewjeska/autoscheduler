
document.addEventListener("DOMContentLoaded", function(event) {
    moment().format();
    /*var authorizeButton = document.getElementById('authorize-button');
    authorizeButton.onclick = handleAuthClick;

    var b2 = document.getElementById('make-calendar');
    b2.onclick = printPermanentEvents;*/

 });

//before making an API call, you have to call getAuthToken, and put your api call in the callback
function makeCalendar(name){
    getAuthToken( (token) => {
        //add a real callback function if you want to do something with the CalId
        createCalendar(name, token, (res) => {});
    });
}
