var newTaskButtonHTML = '<button id="ntask-button" class="btn" style="background-color:#595567">New task</button>'
var addButtonHTML = '<button id="add-button" class="btn" style="background-color:#595567">Add task</button>'
var authenticateButtonHTML = '<button id="authenticate-button" class="btn" style="background-color:#595567; letter-spacing: 0px;">Allow Google Calendar Access</button>'

// Input fields
var taskDetailsHTML = 'Name: <input type="text" name="taskName"><br>'
taskDetailsHTML += 'Due date: <input type="date" name="taskDueDate">'
taskDetailsHTML += 'Hours needed: <input type="text" name="taskHours">'
taskDetailsHTML += 'Preference (0-10): <input type="text" name="taskPreference">'

// Clicking "New task" button brings up input fields and "Add task" (submit) button
document.addEventListener("DOMContentLoaded", function(event) {
  var addButton = document.getElementById('ntask-button');
  addButton.addEventListener('click', function() {
    pagecodediv.innerHTML = taskDetailsHTML;
    document.querySelector('#button-div').innerHTML = addButtonHTML;
    document.querySelector('#descrip-div').innerHTML = '<p class="center"><i>Enter task information below</i></p>';
  }, false);
 })
