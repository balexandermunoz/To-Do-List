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

    //Function that checks if a project already exist and if the name isnt empty. Return a message error if some condition its true, and addProject if pass. 
    checkProject(newProject){
        if(newProject.name === '') return 'Hey! your project need a name'
        else if (this.projects.some( (e)=> e.name === newProject.name )) return (newProject.name + ' already exist! ')
        else                       return 'Done!'
    }
}

export default user;