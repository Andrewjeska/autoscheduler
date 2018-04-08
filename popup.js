
var newTaskButtonHTML = '<a id="ntask-button" class="waves-effect waves-light btn" style="background-color:#595567">New task</button>'
var addButtonHTML = '<a id="add-button" class="waves-effect waves-light btn" style="background-color:#595567">Add task</button>'
var authenticateButtonHTML = '<a id="authenticate-button" class="waves-effect waves-light btn" style="background-color:#595567; letter-spacing: 0px;">Allow Google Calendar Access</button>'

// Input fields
var taskDetailsHTML = '<form id="input">'
taskDetailsHTML += 'Task name: <input type="text" name="taskName" id="nameEntry"><br>'
taskDetailsHTML += 'Due date: <input type="date" name="taskDueDate" id ="dueDateEntry">'
taskDetailsHTML += 'Hours needed: <input type="text" name="taskHours" id="hoursEntry">'
taskDetailsHTML += 'Preference (0-10): <input type="text" name="taskPreference" id="preferenceEntry">'
taskDetailsHTML += '</form>'


var startSleep = "Blah";
var endSleep = "Blah";
var taskList = [];



// Clicking "New task" button brings up input fields and "Add task" (submit) button
document.addEventListener("DOMContentLoaded", function(event) {
    moment().format();

    var nightTimeStart = document.getElementById('sleepStart');
    nightTimeStart.onchange = setStartSleep;

    var nightTimeEnd = document.getElementById('sleepEnd');
    nightTimeEnd.onchange = setEndSleep;

    document.getElementById("submitTasks").addEventListener("click", submitTaskList);

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

 function removeTask(e){
     console.log("remove task");
     //removes the task
    var id = e.target.parentElement.getAttribute("data-taskId");
    e.target.parentElement.parentElement.remove();

    for(var i = 0; i < taskList.length; i++) {
        if(taskList[i].taskName == id) {
            taskList.splice(i, 1);
            console.log(taskList);
            break;
    }

}

 }

 function submitTaskList(e){
     //first, create a calendar with the specified name
     console.log(document.getElementById("calendarName").value);

     //comment out so it doesn't make a calendar for me
     var calName = document.getElementById("calendarName").value;
     if(calName !== ""){
         makeCalendar(document.getElementById("calendarName").value)
     }



     //use chrome api to send an event to the Alex's data processing algo
     var eventData = {
         "startSleep": startSleep,
         "endSleep": endSleep,
         "tasks":taskList

     }

     /*
     Task Object:
         {
             "taskName": taskName,
             "dueDate": taskDueDate,
             "duration": hours,
             "preference": preference
         }

     */

     //chrome.runtime.sendMessage(eventData, someCallback);



 }

  /*var newTaskButton = document.getElementById('ntask-button');
  newTaskButton.addEventListener('click', function() {
    pagecodediv.innerHTML = taskDetailsHTML;
    document.querySelector('#button-div').innerHTML = addButtonHTML;
    document.querySelector('#descrip-div').innerHTML = '<p class="center"><i>Enter task information below</i></p>';

  }, false);
})*/

 $(document).on('click', '#button-div', function(e) {
     console.log(e.target);
   if(e.target && e.target.id == "add-button") {

       //we want to add a task to our list

     //convert form data to <li>
     var taskName = document.getElementById("nameEntry").value;
     var taskDueDate = document.getElementById("dueDateEntry").value; //date object?
     var hours = document.getElementById("hoursEntry").value;
     var preference = document.getElementById("preferenceEntry").value;


     //delete form
     document.getElementById("input").remove();
     document.getElementById("add-button").remove();


     var innerDiv = '<div style="border-style: solid; border-color:#26325A; padding: 1px; margin: 1px; position:relative;" data-taskId='+taskName+'>';

     innerDiv += "Task Name: " + taskName + "<br>";
     innerDiv += '<i style="right:1px; top:1px; position:absolute; color:#26325A; cursor:pointer;" class="fa fa-window-close" aria-hidden="true"></i>';
     innerDiv += "Due Date: " + taskDueDate + "<br>";
     innerDiv += "Hours: " + hours + "<br>";
     innerDiv += "Preference: " + preference + "</div>";

     var li = document.createElement("li");
     li.innerHTML = innerDiv;
     //debugger


     //append task
     document.getElementById("taskList").appendChild(li);

     // add to task list
     taskList.push({
         "taskName": taskName,
         "dueDate": taskDueDate,
         "duration": hours,
         "preference": preference
     });

     // re adding event listener to icons...v bad style but eh

     for (var item of document.querySelectorAll('#taskList li div i')) {
        item.addEventListener("click", removeTask);
    }

    // document.querySelectorAll().addEventListener("click", removeTask);

    //list should be revealed
     document.getElementById("taskList").style.display = "block";

     //re-add NEW TASK button
     document.querySelector('#button-div').innerHTML = newTaskButtonHTML;


 } else if (e.target.id == "ntask-button"){
        // new task, prepare form
         document.getElementById("taskList").style.display = "none";
         pagecodediv.innerHTML = taskDetailsHTML;
         document.querySelector('#button-div').innerHTML = addButtonHTML;
         document.querySelector('#descrip-div p').innerHTML = '<p class="center"><i>Enter task information below</i></p>';

     }

 });
