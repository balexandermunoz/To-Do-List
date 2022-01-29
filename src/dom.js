import Task from "./tasks";
import Project from "./projects";
import user from "./user";
import { format, compareAsc } from 'date-fns'

//Today in 'yyyy-MM-dd':
const currentDate = format(new Date(),'yyyy-MM-dd')

//Initialize things with 1 User, 3 projects inside and one task for each project. 
const newUser = new user();
const project1 = new Project('Project 1');
const project2 = new Project('Project 2');
const project3 = new Project('Project 3');

const task1 = new Task('Example task 1', 'This is a example task','Normal',currentDate);
const task2 = new Task('Example task 2', 'This is a example task','Important', currentDate);
const task3 = new Task('Example task 3', 'This is a example task', 'Urgent', currentDate);

project1.addTask(task1);
project2.addTask(task2);
project3.addTask(task3);

newUser.addProject(project1)
newUser.addProject(project2)
newUser.addProject(project3)

showProjects(newUser);
showTasks(0,newUser);

function showProjects(user) {
    const div = document.querySelector('.projects');
    div.innerHTML = '';
    for(let i = 0; i< user.projects.length;i++){
        let project = document.createElement('h3');
        project.classList.add('project')
        project.textContent = user.projects[i].name;  
        project.addEventListener('click',showTasks.bind(this,i,user))
        div.appendChild(project)
    }
}

function showTasks(i,user){
    const ul = document.querySelector('.tasks');
    const title = document.querySelector('.project-title');
    title.textContent = user.projects[i].name;
    ul.innerHTML = '';
    for(let j = 0; j<user.projects[i].tasksArray.length; j++){
        const li = document.createElement('li');
        const p = document.createElement('p');
        const date = document.createElement('p');

        p.textContent = user.projects[i].tasksArray[j].name;
        date.textContent = user.projects[i].tasksArray[j].date;

        li.classList.add('task');
        li.append(p,date);
        ul.appendChild(li);
    }
}

function buttonAdd(funct,classe) {
    const button = document.createElement('button');
    const icon = document.createElement('img');
    icon.src = 'images/Add-icon.png'
    button.appendChild(icon);
    button.classList.add('add_btn',classe);
    button.addEventListener('click',funct);
    return button;
}

function displayAddProject() {
    const addProjectButton = document.querySelector('.addProject');  //Add project button
    addProjectButton.remove()  //Quit the button for a while

    const left = document.querySelector('.left');       //Left panel 
    const projects = document.querySelector('.projects');   //Div for projects
    
    const divAddProject = document.createElement('div');       //Create div element
    divAddProject.classList.add('divAddProject');

    const inputName = document.createElement('input');      //Create input element
    inputName.classList.add('inputProject');
    inputName.placeholder = "New project";
    divAddProject.appendChild(inputName);

    divAddProject.appendChild(createButtons(acceptProject,closeProject,'addProject-buttons'));
    left.insertBefore(divAddProject, projects); //Display the input button before the projects
}

function createButtons(funct1,funct2,clase) {
    const divButtons = document.createElement('div');
    divButtons.classList.add(clase);

    const p = document.createElement('p'); //To put a message
    p.classList.add('project-error-msg')
    divButtons.appendChild(p);

    const acceptButton = document.createElement('button');
    acceptButton.textContent = 'Ok'
    acceptButton.addEventListener('click',funct1);       //Accept project 
    divButtons.appendChild(acceptButton)

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click',funct2);         // Close new project window
    divButtons.appendChild(closeButton);
    return divButtons;
}


function acceptProject(){
    //Accept project stuff: Include in project class and return 
    let name = document.querySelector('.inputProject').value
    let msg = newUser.addProject(new Project(name)); //Return error mesage or "Done!"
    const div = document.querySelector('.divAddProject');
    const p = document.querySelector('.project-error-msg');
    p.textContent = msg
    div.appendChild(p);

    if (msg !== 'Done!') return
    else {
        showProjects(newUser);
        closeProject.call(this); //At the end, close project 
    }
}

function closeProject() {
    //Close the add project window
    const addProject = document.querySelector('.divAddProject');
    addProject.remove()
    //this.parentNode.remove()
    const left = document.querySelector('.left');       //Left panel 
    left.insertBefore(buttonAdd(displayAddProject,'addProject'), left.firstChild);
}

//Tasks:
function displayAddTask(){
    const addButton = document.querySelector('.addToDo');
    addButton.remove();

    const toDos = document.querySelector('.tasks');
    const main = document.querySelector('main');   //Append some things in the main

    const div = document.createElement('div');
    div.classList.add('new_todo');

    const title = document.createElement('textarea');
    title.classList.add('inputTitleTask')
    title.placeholder = "Title";

    const description = document.createElement('textarea');
    description.classList.add('inputDescriptionTask')
    description.placeholder = "Description";

    const date = document.createElement('input');
    date.classList.add('input-date');
    date.type = 'date';
    date.value = currentDate;
    date.min = currentDate;

    const p = document.createElement('p'); //This is for the error or check mesage
    p.textContent = '';
    p.classList.add('task-error-msg')

    const divPriority = document.createElement('div');
    const urgentButton =  document.createElement('input');
    const importatButton = document.createElement('input');
    const normalButton = document.createElement('input');

    urgentButton.type = 'radio';
    importatButton.type = 'radio';
    normalButton.type = 'radio';
    normalButton.checked = true;

    urgentButton.name = 'priority';
    importatButton.name = 'priority';
    normalButton.name = 'priority';

    urgentButton.value = 'Urgent';
    importatButton.value = 'Importan';
    normalButton.value = 'Normal';

    divPriority.append(urgentButton,importatButton,normalButton,date)

    div.append(title,description,divPriority,p,createButtons(acceptTask,closeTask,'acceptTask-buttons'));

    main.insertBefore(div, toDos); //Insert the div in first place of the list
}

function acceptTask() {
    const title = document.querySelector('.inputTitleTask').value;
    const description = document.querySelector('.inputDescriptionTask').value;
    const priority = document.querySelector('input[name="priority"]:checked').value;
    const date = document.querySelector('input[type="date"]').value;
    const p = document.querySelector('.task-error-msg');

    let currProject = document.querySelector('.project-title').textContent;
    let currProjectIdx = newUser.projects.findIndex(e=>e.name===currProject);
    currProject = newUser.projects.find(e=>e.name===currProject);

    let msg = currProject.addTask(new Task(title,description,priority,date)) //Return error mesage or "Done!"
    p.textContent = msg;
  
    if (msg !== 'Done!') return

    showTasks(currProjectIdx,newUser);
    closeTask();
}

function closeTask() {
    const addTask = document.querySelector('.new_todo');  //Remove the window task
    addTask.remove();

    const main = document.querySelector('main');
    const toDos = document.querySelector('.tasks');

    const button = document.createElement('button');

    button.classList.add('add_btn', 'addToDo');
    main.insertBefore(buttonAdd(displayAddTask,'addToDo'),toDos)
}

export {displayAddTask, displayAddProject};