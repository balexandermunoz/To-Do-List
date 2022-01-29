import Task from "./tasks";
import Project from "./projects";
import { format } from 'date-fns' //Dates

class user {
    constructor(){
        this.projects = []
    }

    addProject(project){
        let checking = this.checkProject(project);  //Return check message
        if (checking !== 'Done!') return checking
        this.projects.push(project)
        return checking
    }

    checkProject(newProject){
        if(newProject.name === '') return 'Hey! your project need a name'
        else if (this.projects.some( (e)=> e.name === newProject.name )) return (newProject.name + ' already exist! ')
        else return 'Done!'
    }

    static createDefaultInstance(){
        //Initialize things with 1 User, 3 projects inside and one task for each project. 
        const currentDate = format(new Date(),'yyyy-MM-dd');
        let newUser = new user();
        const project1 = new Project('Project 1');
        const project2 = new Project('Project 2');
        const project3 = new Project('Project 3');

        const task1 = new Task('Example task 0', 'This is a example task','Normal',currentDate);
        const task2 = new Task('Example task 1', 'This is a example task','Important', currentDate);
        const task3 = new Task('Example task 2', 'This is a example task', 'Urgent', currentDate);

        project1.addTask(task1);
        project1.addTask(task2);
        project1.addTask(task3);
        project2.addTask(task2);
        project3.addTask(task3);

        newUser.addProject(project1)
        newUser.addProject(project2)
        newUser.addProject(project3)
        return newUser
    }

    static storageAvailable(type) {
        var storage;
        try {
            storage = window[type];
            var x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return e instanceof DOMException && (
                e.code === 22 ||
                e.code === 1014 ||
                e.name === 'QuotaExceededError' ||
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                (storage && storage.length !== 0);
        }
    }

    static checkStorage(keyUser){
        if(!localStorage.getItem(keyUser)) {
            console.log('You dont have local storage, creating data...');
            const newUser = user.createDefaultInstance();
            return newUser;
          }
        console.log('You have local storage, loading data...')
        const newUser = this.getUserData(keyUser)
        return newUser;
    }

    static getUserData(keyUser){
        let newUser = JSON.parse(localStorage.getItem(keyUser));
        newUser = Object.assign(new user(), newUser);  //Give functions to newUser
        newUser.projects.forEach( (project,idx) => newUser.projects[idx] = Object.assign(new Project(),project) );
    
        newUser.projects.forEach( (project,i) => {
            project.tasksArray.forEach( (task,j) => {
                project.tasksArray[j] = Object.assign(new Task(), task)                
            })
        });
        return newUser;
    }

    static setUserData(keyUser,user){
        localStorage.setItem(keyUser, JSON.stringify(user));
    }

}

export default user;