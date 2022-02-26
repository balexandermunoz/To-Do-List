import { displayAddTask, displayAddProject } from './dom';

const addProjectButton = document.querySelector('.addProject'); // Add project button
const addTodoButton = document.querySelector('.addTask');
const modal = document.getElementById("myModal");

addProjectButton.addEventListener('click', displayAddProject);

addTodoButton.addEventListener('click', displayAddTask);

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.classList.remove('show')
  }
}

// Responsive things:
// Info button:
const toggleLeftBtn = document.querySelector('.button-toggle-left');
const left = document.querySelector('.left');

toggleLeftBtn.addEventListener('click', toggleMenu);
function toggleMenu() {
  if (left.style.display === 'flex') {
    left.style.display = 'none';
  } else {
    left.style.display = 'flex';
  }
}

// If max-width 550px show the Info by default. Else hide the info:
const mediaInfo = window.matchMedia('(min-width: 550px)');
mediaInfo.addListener(() => {
  if (mediaInfo.matches) { // If media query matches: width greater than 550px
    left.style.display = 'flex';
  } else { // width less than 550px
    left.style.display = 'none';
  }
});