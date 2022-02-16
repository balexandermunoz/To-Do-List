import { format } from 'date-fns'; // Dates
import Task from './tasks';
import Project from './projects';

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

class user {
  constructor() {
    this.defaultProjects = [];
    this.projects = [];
  }

  addProject(project) {
    const checking = this.checkProject(project.name); // Return check message
    if (checking !== 'Done!') return checking;

    if (project.defProject) this.defaultProjects.push(project);
    else this.projects.push(project);
    return checking;
  }

  removeProject(project) {
    this.projects.splice(project.idx, 1);
  }

  checkProject(newProjectName) {
    if (newProjectName === '') return 'Hey! your project need a name';
    if (this.projects.some((e) => e.name === newProjectName)) return (`${newProjectName} already exist! `);
    if (this.defaultProjects.some((e) => e.name === newProjectName)) return (`${newProjectName} already exist! `);

    return 'Done!';
  }

  getNumberOfDefProjects() {
    return this.projects.filter((project) => project.defProject).length;
  }

  sortProjects(orderList) {
    if (orderList.length !== this.projects.length) return console.error('orderList no match whit quantity of tasks');
    for (let i = 0; i < this.projects.length; i++) {
      this.projects[orderList[i]].idx = i;
    }
    this.projects.sort((a, b) => a.idx - b.idx);
  }

  getProject(projectName) {
    let project;
    // First serach in projects, If don't find anything, search in default projects
    project = this.projects.find((project) => project.name === projectName);
    if (!project) project = this.defaultProjects.find((project) => project.name === projectName);
    return project;
  }

  static createDefaultInstance() {
    // Initialize things with 1 User, 3 projects inside and one task for each project.
    const date = new Date();
    const currentDate = format(date, 'yyyy-MM-dd');
    const treeDays = format(date.addDays(3), 'yyyy-MM-dd');
    const fiveDays = format(date.addDays(5), 'yyyy-MM-dd');

    const newUser = new user();
    const project1 = new Project('General', true);
    const project2 = new Project('Today', true);
    const project3 = new Project('This week', true);
    const myProject = new Project('My project');

    const task1 = new Task('Example task 0', 'This is a example task', 'Normal', currentDate);
    const task2 = new Task('Example task 1', 'This is a example task', 'Important', treeDays);
    const task3 = new Task('Example task 2', 'This is a example task', 'Urgent', fiveDays);

    project1.addTask(task1);
    project1.addTask(task2);
    project1.addTask(task3);
    project2.addTask(task2);
    project3.addTask(task3);
    myProject.addTask(task3);

    newUser.addProject(project1);
    newUser.addProject(project2);
    newUser.addProject(project3);
    newUser.addProject(myProject);
    return newUser;
  }

  static storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return e instanceof DOMException && (
        e.code === 22
                || e.code === 1014
                || e.name === 'QuotaExceededError'
                || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
                && (storage && storage.length !== 0);
    }
  }

  static checkStorage(keyUser) {
    if (!localStorage.getItem(keyUser)) {
      console.log('You dont have local storage, creating data...');
      const newUser = user.createDefaultInstance();
      return newUser;
    }
    console.log('You have local storage, loading data...');
    const newUser = this.getUserData(keyUser);
    return newUser;
  }

  static getUserData(keyUser) {
    // New user contain projects and task for each project, without methods
    let newUser = JSON.parse(localStorage.getItem(keyUser));
    newUser = Object.assign(new user(), newUser);
    user.reasignProjectClass(newUser.defaultProjects);
    user.reasignProjectClass(newUser.projects);

    return newUser;
  }

  static reasignProjectClass(projectsList) {
    projectsList.forEach((project, i) => {
      projectsList[i] = Object.assign(new Project(), project);
      project.tasksArray.forEach((task, j) => {
        project.tasksArray[j] = Object.assign(new Task(), task);
      });
    });
  }

  static setUserData(keyUser, user) {
    localStorage.setItem(keyUser, JSON.stringify(user));
  }
}

export default user;
