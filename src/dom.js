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
        newTitle.classList.add('input-project');
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
      });
      project.append(editIcon);
    }

    div.appendChild(project);
    user.setUserData('User', newUser);
  }
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
      displayAddTask(this,tasksList[j].name,
        tasksList[j].description,
        tasksList[j].priority,
        tasksList[j].date,
      );
    });
    description.classList.add('td1-description');
    description.textContent = tasksList[j].description;
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

    //When you add new task or project, save the data: 
    user.setUserData('User', newUser);
  }
}

function displayAddProject() {
  const addProjectBtn = document.querySelector('.addProject');
  const divAddProject = document.querySelector('.divAddProject');
  const confirmProjectBtn = document.getElementById('accept-project-button');
  const closeProjectBtn = document.getElementById('close-project');

  addProjectBtn.style.display = 'none';
  divAddProject.style.display = 'block';

  confirmProjectBtn.addEventListener('click', acceptProject);
  closeProjectBtn.addEventListener('click',closeProject)
}

function acceptProject() {
  // Accept project stuff: Include in project class and return
  const name = document.querySelector('.input-project').value;
  const msg = newUser.addProject(new Project(name));
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
  const addProjectBtn = document.querySelector('.addProject');
  const addProject = document.querySelector('.divAddProject');

  addProject.style.display = 'none';
  addProjectBtn.style.display = 'block'; 
}


// Tasks:
function displayAddTask(e,curTitle = '', curDescription = '', currPriority = 'none', currDate = 'none') {
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  const date = document.querySelector('.input-date');
  const acceptButton = document.querySelector('#accept-task-button');
  const closeTaskButton = document.querySelector('#close-task');

  document.getElementById("myModal").style.display = 'block';
  document.querySelector('.input-title').value = curTitle;
  document.querySelector('.input-description').value = curDescription;
  document.querySelector('.task-error-msg').textContent = '';

  if (currDate === 'none') date.value = currentDate;
  else date.value = currDate;
  date.min = currentDate;
  
  if (currPriority === 'Urgent') radioButtons[0].checked = true;
  else if (currPriority === 'Important') radioButtons[1].checked = true;
  else radioButtons[2].checked = true;
  
  acceptButton.addEventListener('click',acceptTask);
  closeTaskButton.addEventListener('click',closeTask)
}

function acceptTask() {
  const title = document.querySelector('.input-title').value;
  const description = document.querySelector('.input-description').value;
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
  const modal = document.getElementById("myModal");
  modal.style.display = 'none';
}

export { displayAddTask, displayAddProject };
