import { isToday, isThisWeek } from 'date-fns'

class Project {
    constructor(name){
        this.idx;
        this.name = name;
        this.tasksArray = []
    }

    addTask(task) {
        const checking = this.checkTask(task)
        if (checking !== 'Done!') return checking
        this.tasksArray.push(task)
        return checking
    }

    deleteTask(task){
        this.tasksArray.splice(task.idx,1);
    }

    checkTask(task){
        if (task.name === '') return 'Hey! your task is unamed :( ';
        return 'Done!';
    }

    sortTasks(orderList){
        if(orderList.length !== this.tasksArray.length) return console.error("orderList no match whit quantity of tasks");
        for(let i = 0; i<this.tasksArray.length; i++){
            this.tasksArray[orderList[i]].idx = i;
        }  
        this.tasksArray.sort((a,b) => a.idx - b.idx);
    }

    getTodayTasks(){
        return this.tasks.filter((task) => {
            const taskDate = new Date(task.getDateFormatted())
            return isToday(toDate(taskDate))
        })
    }

    getWeekTasks(){
        return this.tasks.filter((task) => {
            const taskDate = new Date(task.getDateFormatted())
            return isThisWeek(subDays(toDate(taskDate), 1))
          })
        }
}

export default Project;