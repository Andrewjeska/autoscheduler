
var newTaskButtonHTML = '<button id="ntask-button" class="btn" style="background-color:#595567">New task</button>'
var addButtonHTML = '<button id="add-button" class="btn" style="background-color:#595567">Add task</button>'
var authenticateButtonHTML = '<button id="authenticate-button" class="btn" style="background-color:#595567; letter-spacing: 0px;">Allow Google Calendar Access</button>'

// Input fields
var taskDetailsHTML = '<form id="input">'
taskDetailsHTML += 'Task name: <input type="text" name="taskName" id="nameEntry"><br>'
taskDetailsHTML += 'Due date: <input type="date" name="taskDueDate" id ="dueDateEntry">'
taskDetailsHTML += 'Hours needed: <input type="text" name="taskHours" id="hoursEntry">'
taskDetailsHTML += 'Preference (0-10): <input type="text" name="taskPreference" id="preferencEntry">'
taskDetailsHTML += '</form>'


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

  var newTaskButton = document.getElementById('ntask-button');
  newTaskButton.addEventListener('click', function() {
    pagecodediv.innerHTML = taskDetailsHTML;
    document.querySelector('#button-div').innerHTML = addButtonHTML;
    document.querySelector('#descrip-div').innerHTML = '<p class="center"><i>Enter task information below</i></p>';

  }, false);
 })

 $(document).on('click', '#button-div', function(e) {
   if(e.target) {
     //convert form data to <li>
     var taskname = document.getElementById("nameEntry");
     var taskDueDate = document.getElementById("dueDateEntry"); //date object?
     var hours = document.getElementById("hoursEntry");
     var preference = document.getElementById("preferece");


     //delete form
     document.getElementById("input").remove();

     var listElement = '<li><div style="border-style: solid;" >';
     listElement += taskname + "<br>";
     listElement += taskDueDate + "<br>";
     listElement += hours + "<br>";
     listElement += preference;

     document.getElementById("taskList").appendChild(listElement);
     //add an <li> to a list taskList
     /*
     <li>
      <div>
        // write out task details nicely
      </div>
    </li>

    append to ul with id "taskList"

     */

   }

 });
