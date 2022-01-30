import Task from "./tasks";
import Project from "./projects";
import { format } from 'date-fns' //Dates

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

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

    sortProjects(orderList){
        if(orderList.length !== this.projects.length) return console.error("orderList no match whit quantity of tasks");
        for(let i = 0; i<this.projects.length; i++){
            this.projects[orderList[i]].idx = i;
        }  
        this.projects.sort((a,b) => a.idx - b.idx);
    }

    getProject(projectName){
        return this.projects.find((project) => project.name === projectName)
    }

    static createDefaultInstance(){
        //Initialize things with 1 User, 3 projects inside and one task for each project. 
        const date = new Date();
        const currentDate = format(date,'yyyy-MM-dd');
        const treeDays = format(date.addDays(3),'yyyy-MM-dd');
        const fiveDays = format(date.addDays(5),'yyyy-MM-dd');

        let newUser = new user();
        const project1 = new Project('General');
        const project2 = new Project('Today');
        const project3 = new Project('This week');

        const task1 = new Task('Example task 0', 'This is a example task','Normal',currentDate);
        const task2 = new Task('Example task 1', 'This is a example task','Important', treeDays);
        const task3 = new Task('Example task 2', 'This is a example task', 'Urgent', fiveDays);

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
        //New user contain projects and task for each project, without methods
        let newUser = JSON.parse(localStorage.getItem(keyUser));
        newUser = Object.assign(new user(), newUser);
        newUser.projects.forEach( (project,i) => {
            newUser.projects[i] = Object.assign(new Project(),project)
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