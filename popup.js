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


// Clicking "New task" button brings up input fields and "Add task" (submit) button
document.addEventListener("DOMContentLoaded", function(event) {
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
