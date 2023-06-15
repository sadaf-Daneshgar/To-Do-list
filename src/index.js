import './style.css';

const tasks = [
  { description: 'Finish to do list project', completed: false, index: 1 },
  { description: 'Learn webpack', completed: true, index: 2 },
  { description: 'Reivew my code', completed: false, index: 3 },
];

function renderTasks() {
  const tasksList = document.getElementById('tasks-list');

  tasks.forEach((task) => {
    // eslint-disable-next-line no-use-before-define
    const taskItem = createTaskItem(task.description);
    tasksList.appendChild(taskItem);
  });
}

function createTaskItem(description) {
  const taskItem = document.createElement('div');
  taskItem.className = 'task-item d-flex align-items-center';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'form-check-input me-2';
  taskItem.appendChild(checkbox);

  const taskDescription = document.createElement('label');
  taskDescription.className = 'task-description';
  taskDescription.textContent = description;
  taskItem.appendChild(taskDescription);

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-btn btn btn-danger btn-sm ms-2';
  deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
  taskItem.appendChild(deleteButton);

  return taskItem;
}

function addTask() {
  const inputField = document.querySelector('.add');
  const description = inputField.value.trim();

  if (description !== '') {
    const taskItem = createTaskItem(description);
    const tasksList = document.getElementById('tasks-list');
    tasksList.appendChild(taskItem);
    inputField.value = '';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  renderTasks();

  const addButton = document.querySelector('.btn-add');
  addButton.addEventListener('click', addTask);
});
