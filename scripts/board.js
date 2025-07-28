import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { app } from "./firebase.js";

const db = getDatabase(app);


// Toggle Add Task Overlay
window.toggleAddTaskBoard = function () {
  $d("overlay-add-task").classList.toggle("d-none");
}

// task overlay
window.showTaskOverlay = function () {
    $("task-overlay-bg").classList.toggle("d-none");
}

function loadTasksFromFirebase() {
  const tasksRef = ref(db, "tasks");
  onValue(tasksRef, (snapshot) => {
    const tasks = snapshot.val();
    renderToDoTasks(tasks);
  });
}

function renderToDoTasks(tasks) {
  const todoColumn = document.getElementById("to-do-column");
  todoColumn.innerHTML = ""; 
  for (let taskId in tasks) {
    const task = tasks[taskId];
    const taskElement = createTaskElement(task);
    todoColumn.appendChild(taskElement);
  }
}

function createTaskElement(task) {
  const ticket = document.createElement('div');
  ticket.classList.add('ticket');
  ticket.innerHTML = `
    <div class="ticket-content">
      <div class="label" style="background-color: ${getCategoryColor(task.category)};">
        ${task.category}
      </div>
      <div class="frame">
        <span class="ticket-title">${task.title}</span>
        <span class="ticket-text">${task.description}</span>
      </div>
      ${task.subtasks && task.subtasks.length > 0 ? renderSubtaskProgress(task.subtasks) : ''}
      <div class="initials-icon-box">
        <div class="initials">
          ${renderInitials(task.assignedTo)}
        </div>
        <img src="./assets/icons/board/${task.priority.toLowerCase()}.svg" alt="${task.priority}">
      </div>
    </div>
  `;

  return ticket;
}

function getCategoryColor(category) {
  switch (category.toLowerCase()) {
    case 'design': return '#FF7A00'; // Orange
    case 'development': return '#29ABE2'; // Blau
    case 'marketing': return '#2AD300'; // Grün
    default: return '#FF7A00'; // Fallback-Farbe
  }
}

function renderInitials(assignedTo = []) {
  return assignedTo.map((name, index) => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
    const zIndex = index + 1;
    const marginLeft = index === 0 ? 0 : -10;

    return `<div class="first-initial" style="z-index: ${zIndex}; margin-left: ${marginLeft}px;">
              <img src="./assets/icons/profile/profile_icon_${(index % 3) + 1}.svg" alt="${initials}">
            </div>`;
  }).join('');
}

function renderSubtaskProgress(subtasks) {
  const total = subtasks.length;
  const done = subtasks.filter(st => st.done).length;
  const percentage = total ? Math.round((done / total) * 100) : 0;

  return `
    <div class="subtasks-box">
      <div class="progressbar">
        <div class="progressbar-inlay" style="width: ${percentage}%"></div>
      </div>
      <span>${done}/${total} Subtasks</span>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  loadTasksFromFirebase();
});
