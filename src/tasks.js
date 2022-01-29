class Task {
    constructor(name,description,priority,date){
        this.idx;
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.date = date;
        this.checked = false;
    }

    toggleCheck(){
        this.checked = !this.checked;
        console.log(this,this.checked)
    }
}

export default Task;