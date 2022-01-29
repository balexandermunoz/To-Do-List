import _ from 'lodash';
import {displayAddTask, displayAddProject} from './dom';

const addProjectButton = document.querySelector('.addProject'); //Add project button
addProjectButton.addEventListener('click',displayAddProject);

const addTodoButton = document.querySelector('.addTask'); //Add todo button
addTodoButton.addEventListener('click',displayAddTask);