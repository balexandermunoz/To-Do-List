import { format } from 'date-fns'; // Dates
import Sortable from 'sortablejs'; // Sorteable lists!
import Task from './tasks';
import Project from './projects';
import user from './user';

const date = new Date();
const currentDate = format(date, 'yyyy-MM-dd');
// Storage things:
// localStorage.clear() //Clean the local storage
let newUser;
if (user.storageAvailable('localStorage')) {
  console.log('Aviliable local storage!');
  newUser = user.checkStorage('User');
} else {
  console.log('Your data will be deleted after close this page.');
  newUser = user.createDefaultInstance();
}

showProjects(newUser.defaultProjects);
showProjects(newUser.projects);
showTasks(newUser.defaultProjects[1]);

const ul = document.querySelector('.tasks');
const sortableProjects = new Sortable(ul, {
  animation: 200,
  ghostClass: 'ghost',
  onEnd(event) {
    const currProjectName = 
      document.querySelector('.project-title').textContent;
    const currProject = newUser.getProject(currProjectName);
    const arrayNodes = [...event.from.childNodes];
    const arrayNodesIdx = arrayNodes.map((e) => parseInt(e.id));
    currProject.sortTasks(arrayNodesIdx);
    showTasks(currProject);
  },
});

const projectsDiv = document.querySelector('.projects');
const sortableTasks = new Sortable(projectsDiv, {
  group: 'projects',
  animation: 200,
  ghostClass: 'ghost',
  onEnd(event) {
    const arrayNodes = [...event.from.childNodes];
    const arrayNodesIdx = arrayNodes.map((e) => parseInt(e.id));
    newUser.sortProjects(arrayNodesIdx);
    showProjects(newUser.projects);
  },
});

function showProjects(projectsList) {
  let div = document.querySelector('.projects');
  div.innerHTML = '';
  if (projectsList.length <= 0) return;
  if (projectsList[0].defProject) div = document.querySelector('.default-projects');
  for (let i = 0; i < projectsList.length; i++) {
    const project = document.createElement('div');
    const projectTitle = document.createElement('h3');
    project.id = i;
    projectsList[i].idx = i;
    project.classList.add('project');
    projectTitle.textContent = projectsList[i].name;
    project.addEventListener('click', showTasks.bind(this, projectsList[i]));
    project.append(projectTitle);
    // If isnt a default project, add the button
    if (!projectsList[0].defProject) {
      const editIcon = document.createElement('img');
      editIcon.classList.add('icon', 'editIcon');
      editIcon.src = 'images/edit.png';
      editIcon.addEventListener('click', () => {
        const div1 = document.createElement('div');
        const newTitle = document.createElement('input');
        const acceptButton = document.createElement('img');
        const cancelButton = document.createElement('img');
        const deleteButton = document.createElement('img');

        div1.classList.add('project-div1');
        newTitle.type = 'text';
        newTitle.classList.add('inputProject');
        newTitle.value = projectTitle.textContent;
        acceptButton.src = 'images/Accept.png';
        acceptButton.classList.add('icon');
        acceptButton.addEventListener('click', () => {
          const checking = newUser.checkProject(newTitle.value);
          if (checking === 'Done!' || newTitle.value === projectsList[i].name) {
            projectsList[i].name = newTitle.value;
            showProjects(projectsList);
          } else {
            alert(`${newTitle.value} already exist!`);
          }
        });

        cancelButton.src = 'images/delete2.png';
        cancelButton.classList.add('icon');
        cancelButton.addEventListener('click', () => showProjects(projectsList));

        deleteButton.src = 'images/delete.png';
        deleteButton.classList.add('icon', 'delete-icon');
        deleteButton.addEventListener('click', () => {
          newUser.removeProject(projectsList[i]);
          showProjects(projectsList);
        });

        projectTitle.remove();
        editIcon.remove();
        div1.append(newTitle, acceptButton, cancelButton);
        project.append(div1, deleteButton);
        modifyProject(projectTitle);
      });
      project.append(editIcon);
    }

    div.appendChild(project);
    user.setUserData('User', newUser);
  }
}

function modifyProject(projectTitle) {
  const currProject = newUser.getProject(projectTitle);
  const divProject = document.getElementById('0');
}

function showTasks(project) {
  const ul = document.querySelector('.tasks');
  const projectTitle = document.querySelector('.project-title');
  const tasksList = project.tasksArray;
  projectTitle.textContent = project.name;

  ul.innerHTML = '';
  for (let j = 0; j < tasksList.length; j++) {
    const li = document.createElement('tr');
    const { priority } = tasksList[j];
    li.classList.add('task', `priority-${priority}`);
    li.id = j;
    tasksList[j].idx = j;

    // Checkbox, title and description:
    const td1 = document.createElement('td');
    const checkbox = document.createElement('input');
    const taskName = document.createElement('b');
    const description = document.createElement('td');

    checkbox.type = 'checkbox';
    checkbox.checked = tasksList[j].checked;
    checkbox.addEventListener('click', () => {
      tasksList[j].toggleCheck();
      showTasks(project);
    });
    if (checkbox.checked) taskName.classList.add('checkedTask');
    else if (!checkbox.checked && taskName.classList.contains('checkedTask')) p.classList.remove('checkedTask');
    taskName.textContent = tasksList[j].name;
    taskName.addEventListener('click', () => {
      displayAddTask(tasksList[j].name,
        tasksList[j].description,
        tasksList[j].priority,
        tasksList[j].date,
      );
    });
    description.classList.add('td1-description');
    description.textContent = tasksList[j].description;
    description.addEventListener('click', () => {
      displayAddTask(tasksList[j].name, tasksList[j].description, tasksList[j].priority, tasksList[j].date);
    });
    td1.append(checkbox, taskName, description);

    // Date and delete icon:
    const td2 = document.createElement('td');
    const date = document.createElement('p');
    const deleteIcon = document.createElement('img');

    date.textContent = tasksList[j].date;
    deleteIcon.classList.add('icon', 'deleteIcon');
    deleteIcon.src = 'images/delete2.png';

    deleteIcon.addEventListener('click', () => {
      project.deleteTask(tasksList[j]);
      showTasks(project);
    });

    td2.classList.add('td2');
    td2.append(date, deleteIcon);

    li.append(td1, td2);
    ul.appendChild(li);

    user.setUserData('User', newUser);
  }
}

function buttonAdd(funct, classe) {
  const button = document.createElement('button');
  const icon = document.createElement('img');
  icon.src = 'images/Add-icon.png';
  button.appendChild(icon);
  button.classList.add('add_btn', classe);
  button.addEventListener('click', funct);
  return button;
}

function displayAddProject() {
  const addProjectButton = document.querySelector('.addProject'); // Add project button
  addProjectButton.remove(); // Quit the button for a while

  const left = document.querySelector('.left'); // Left panel
  const projects = document.querySelector('.default-projects'); // Div for projects

  const divAddProject = document.createElement('div'); // Create div element
  divAddProject.classList.add('divAddProject');

  const inputName = document.createElement('input'); // Create input element
  inputName.classList.add('inputProject');
  inputName.placeholder = 'Project name';
  divAddProject.append(inputName, createButtons(acceptProject, closeProject, 'addProject-button'));

  left.insertBefore(divAddProject, projects); // Display the input button before the projects
}

function createButtons(funct1, funct2, clase) {
  const divButtons = document.createElement('div');
  const p = document.createElement('p'); // To put a message
  p.classList.add('project-error-msg');
  divButtons.classList.add('div-buttons');
  divButtons.appendChild(p);

  const acceptButton = document.createElement('img');
  acceptButton.src = 'images/Accept.png';
  acceptButton.classList.add(clase);
  acceptButton.addEventListener('click', funct1); // Accept project
  divButtons.appendChild(acceptButton);

  const closeButton = document.createElement('img');
  closeButton.src = 'images/delete2.png';
  closeButton.classList.add(clase);
  closeButton.addEventListener('click', funct2); // Close new project window
  divButtons.appendChild(closeButton);
  return divButtons;
}

function acceptProject() {
  // Accept project stuff: Include in project class and return
  const name = document.querySelector('.inputProject').value;
  const msg = newUser.addProject(new Project(name)); // Return error mesage or "Done!"
  const div = document.querySelector('.divAddProject');
  const p = document.querySelector('.project-error-msg');
  p.textContent = msg;
  div.appendChild(p);

  if (msg !== 'Done!') return;

  showProjects(newUser.projects);
  closeProject.call(this); // At the end, close project
}

function closeProject() {
  // Close the add project window
  const addProject = document.querySelector('.divAddProject');
  addProject.remove();
  const left = document.querySelector('.left'); // Left panel
  left.insertBefore(buttonAdd(displayAddProject, 'addProject'), left.firstChild);
}

// Tasks:
function displayAddTask(e, curTitle = '', curDescription = '', currPriority = 'none', currDate = 'none') {
  const addButton = document.querySelector('.addTask');
  addButton.remove();

  const toDos = document.querySelector('.tasks');
  const main = document.querySelector('main'); // Append some things in the main

  const div = document.createElement('div');
  div.classList.add('new_todo');

  const title = document.createElement('textarea');
  title.classList.add('inputTitleTask');
  title.placeholder = 'Title';
  title.value = curTitle;

  const description = document.createElement('textarea');
  description.classList.add('inputDescriptionTask');
  description.placeholder = 'Description';
  description.value = curDescription;

  const date = document.createElement('input');
  date.classList.add('input-date');
  date.type = 'date';
  if (currDate === 'none') date.value = currentDate;
  else date.value = currDate;
  date.min = currentDate;

  const p = document.createElement('p'); // This is for the error or check mesage
  p.textContent = '';
  p.classList.add('task-error-msg');

  const divPriorityDate = document.createElement('div');
  const divPriority = document.createElement('div');
  const urgentButton = document.createElement('input');
  const importatButton = document.createElement('input');
  const normalButton = document.createElement('input');

  urgentButton.type = 'radio';
  importatButton.type = 'radio';
  normalButton.type = 'radio';
  if (currPriority === 'Urgent') urgentButton.checked = true;
  else if (currPriority === 'Important') importatButton.checked = true;
  else normalButton.checked = true;

  urgentButton.name = 'priority';
  importatButton.name = 'priority';
  normalButton.name = 'priority';

  urgentButton.value = 'Urgent';
  importatButton.value = 'Important';
  normalButton.value = 'Normal';
  divPriority.classList.add('div-priority');
  divPriority.append(urgentButton, importatButton, normalButton);
  divPriorityDate.classList.add('div-prioritydate');
  divPriorityDate.append(divPriority, date);

  div.append(title, description, divPriorityDate, p, createButtons(acceptTask, closeTask, 'acceptTask-button'));

  main.insertBefore(div, toDos); // Insert the div in first place of the list
}

function acceptTask() {
  const title = document.querySelector('.inputTitleTask').value;
  const description = document.querySelector('.inputDescriptionTask').value;
  const priority = document.querySelector('input[name="priority"]:checked').value;
  const date = document.querySelector('input[type="date"]').value;
  const p = document.querySelector('.task-error-msg');

  let currProject = document.querySelector('.project-title').textContent;

  currProject = newUser.getProject(currProject);

  const addingTask = new Task(title, description, priority, date);
  const msg = currProject.addTask(addingTask); // Return error mesage or "Done!"
  if (addingTask.todayTask()) newUser.getProject('Today').addTask(addingTask);
  if (addingTask.thisWeekTask()) newUser.getProject('This week').addTask(addingTask);
  p.textContent = msg;

  if (msg !== 'Done!') return;

  showTasks(currProject);
  closeTask();
}

function closeTask() {
  const addTask = document.querySelector('.new_todo'); // Remove the window task
  addTask.remove();

  const main = document.querySelector('main');
  const toDos = document.querySelector('.tasks');

  const button = document.createElement('button');

  button.classList.add('add_btn', 'addTask');
  main.insertBefore(buttonAdd(displayAddTask, 'addTask'), toDos);
}

export { displayAddTask, displayAddProject };
