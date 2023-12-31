let tasks = [];
// Array to store the tasks
const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const updateTaskIndexes = () => {
  tasks.forEach((task, index) => {
    task.index = index + 1;
  });
};

const deleteTask = (task) => {
  const index = tasks.indexOf(task);
  if (index > -1) {
    tasks.splice(index, 1);
    updateTaskIndexes();
    // Update the indexes of the remaining tasks
    saveTasks();
  }
};

const reorderTasks = (fromIndex, toIndex) => {
  const [task] = tasks.splice(fromIndex, 1);
  tasks.splice(toIndex, 0, task);
  saveTasks();
};

const createTaskItem = (task) => {
  const taskItem = document.createElement('li');
  taskItem.className = 'task-item';

  const checkbox = document.createElement('input');
  // Create a checkbox for task completion
  checkbox.type = 'checkbox';
  checkbox.className = 'form-check-input';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    saveTasks();
  });
  taskItem.appendChild(checkbox);

  const taskDescription = document.createElement('span');
  taskDescription.className = 'task-description';
  taskDescription.textContent = task.description;
  taskDescription.contentEditable = true;
  taskDescription.addEventListener('input', () => {
    task.description = taskDescription.textContent;
    saveTasks();
  });
  taskItem.appendChild(taskDescription);

  const deleteButton = document.createElement('button');
  // Create a delete button for removing the task
  deleteButton.type = 'button';
  deleteButton.className = 'delete-btn';
  deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
  deleteButton.addEventListener('click', () => {
    deleteTask(task);
    taskItem.remove(); // Remove the task item from the DOM
  });
  taskItem.appendChild(deleteButton);

  taskItem.draggable = true;
  taskItem.addEventListener('dragstart', (event) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify({ index: task.index }));
    event.target.classList.add('dragging');
  });
  taskItem.addEventListener('dragend', () => {
    const draggingItem = document.querySelector('.dragging');
    if (draggingItem) {
      draggingItem.classList.remove('dragging');
    }
  });
  taskItem.addEventListener('dragover', (event) => {
    event.preventDefault();
    const taskItem = event.target.closest('.task-item');
    if (taskItem) {
      taskItem.classList.add('drag-over');
    }
  });
  taskItem.addEventListener('dragleave', (event) => {
    const taskItem = event.target.closest('.task-item');
    if (taskItem) {
      taskItem.classList.remove('drag-over');
    }
  });
  taskItem.addEventListener('drop', (event) => {
    event.preventDefault();
    const fromIndex = JSON.parse(event.dataTransfer.getData('text/plain')).index;
    const taskItem = event.target.closest('.task-item');
    if (taskItem) {
      const toIndex = Array.from(taskItem.parentNode.children).indexOf(taskItem);
      reorderTasks(fromIndex - 1, toIndex);
    }
    taskItem.classList.remove('drag-over');
  });

  return taskItem;
};

const renderTasks = () => {
  const tasksList = document.getElementById('tasks-list');
  tasksList.innerHTML = '';

  tasks.forEach((task) => {
    const taskItem = createTaskItem(task);
    tasksList.appendChild(taskItem);
  });
};

const addTask = (description) => {
  const newTask = {
    description,
    completed: false,
    index: tasks.length + 1,
  };

  tasks.push(newTask);
  updateTaskIndexes();
  renderTasks();
  saveTasks();
};

const clearCompletedTasks = () => {
  tasks = tasks.filter((task) => !task.completed);
  // Remove completed tasks from the array
  updateTaskIndexes();
  renderTasks();
  saveTasks();
};

window.addEventListener('DOMContentLoaded', () => {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    renderTasks();
  }

  const addButton = document.querySelector('.btn-add');
  addButton.addEventListener('click', () => {
    const inputField = document.querySelector('.add');
    const description = inputField.value.trim();
    if (description !== '') {
      addTask(description);
      inputField.value = '';
    }
  });

  const clearButton = document.querySelector('.clear-btn');
  clearButton.addEventListener('click', clearCompletedTasks);
});

const tasksforexport = {
  tasks,
  renderTasks,
  createTaskItem,
  addTask,
  deleteTask,
  clearCompletedTasks,
  reorderTasks,
  saveTasks,
};

export default tasksforexport;