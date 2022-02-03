import { format,isToday,isThisWeek,toDate } from 'date-fns' //Dates

class Task {
    constructor(name,description,priority,date){
        this.idx;
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.date = date;
        this.checked = false;
    }

    todayTask(){ //Not work
        let date = toDate(new Date(this.date))
        return isToday(date)
    }

    toggleCheck(){
        this.checked = !this.checked;
    }

    thisWeekTask(){
        let date = toDate(new Date(this.date))
        return isThisWeek(date)
    }
}

export default Task;