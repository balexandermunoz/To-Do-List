class Project {
    constructor(name){
        this.name = name;
        this.tasksArray = []
    }

    addTask(task) {
        const checking = this.checkTask(task)
        if (checking !== 'Done!') return checking
        this.tasksArray.push(task)
        return checking
    }

    checkTask(task){
        if (task.name === '') return 'Hey! your task is unamed :( ';
        return 'Done!';
    }
}

export default Project;