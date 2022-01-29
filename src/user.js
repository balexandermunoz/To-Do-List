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

}

export default user;