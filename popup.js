
var newTaskButtonHTML = '<button id="ntask-button" class="btn" style="background-color:#595567">New task</button>'
var addButtonHTML = '<button id="add-button" class="btn" style="background-color:#595567">Add task</button>'
var authenticateButtonHTML = '<button id="authenticate-button" class="btn" style="background-color:#595567; letter-spacing: 0px;">Allow Google Calendar Access</button>'

// Input fields
var taskDetailsHTML = 'Name: <input type="text" name="taskName"><br>'
taskDetailsHTML += 'Due date: <input type="date" name="taskDueDate">'
taskDetailsHTML += 'Hours needed: <input type="text" name="taskHours">'
taskDetailsHTML += 'Preference (0-10): <input type="text" name="taskPreference">'

var startSleep = "Blah";
var endSleep = "Blah";

// Clicking "New task" button brings up input fields and "Add task" (submit) button
document.addEventListener("DOMContentLoaded", function(event) {
    moment().format();

    var nightTimeStart = document.getElementById('sleepStart');
    nightTimeStart.onchange = setStartSleep;

    var nightTimeEnd = document.getElementById('sleepEnd');
    nightTimeEnd.onchange = setEndSleep;

    var addButton = document.getElementById('ntask-button');
    addButton.addEventListener('click', function() {
        pagecodediv.innerHTML = taskDetailsHTML;
        document.querySelector('#button-div').innerHTML = addButtonHTML;
        document.querySelector('#descrip-div').innerHTML = '<p class="center"><i>Enter task information below</i></p>';
    }, false);


 })

 //before making an API call, you have to call getAuthToken, and put your api call in the callback
 function makeCalendar(name){
     getAuthToken( (token) => {
         //add a real callback function if you want to do something with the CalId
         createCalendar(name, token, (res) => {});
     });
 }

 function setStartSleep(e){
     console.log(e.target.value);
     startSleep = e.target.value;
 }

 function setEndSleep(e){
     console.log(e.target.value);
     endSleep = e.target.value;
 }
