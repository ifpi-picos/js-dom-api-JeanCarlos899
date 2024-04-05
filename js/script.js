document.addEventListener('DOMContentLoaded', restoreTasks);
document.querySelector('.btn-task').addEventListener('click', toggleModal);
document.querySelector('.btn-close').addEventListener('click', toggleModal);
document.querySelector('.form-task').addEventListener('submit', addTask);

function toggleModal() {
    document.querySelector('.modal').classList.toggle('show');
}

function addTask(event) {
    event.preventDefault();

    const task = {
        id: Date.now(),
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        date: document.getElementById('task-date').value,
        tag: document.getElementById('task-tag').value,
    };

    displayTask(task);
    saveTask(task);
    toggleModal();
    updateTaskCount();
    event.target.reset();
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function displayTask(task) {
    const taskList = document.querySelector('.task-list');
    const li = document.createElement('li');
    if (task.completed) {
        li.classList.add('completed');
    }
    task.date = new Date(task.date).toLocaleDateString('pt-BR');
    li.innerHTML = `
        <div class="task-content">
            <p class="task-title">${task.title}</p>
            <p class="task-description">${task.description}</p>
            <div class="task-details">
                <span class="task-date">${task.date}</span>
                <span class="task-tag"><i class="fas fa-tags"></i>${task.tag}</span>
            </div>
        </div>
        <div class="task-actions">
            <button class="btn-delete" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash-alt"></i>
            </button>
            <button class="btn-conclude" onclick="concludeTask(${task.id})">Concluir tarefa</button>
        </div>
    `;

    taskList.appendChild(li);
    updateTaskCount();
}

function restoreTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => displayTask(task));
}

function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.querySelector('.task-list').innerHTML = '';
    tasks.forEach(task => displayTask(task));
    updateTaskCount();
}

function concludeTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    tasks[taskIndex].completed = true;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.querySelector('.task-list').innerHTML = '';
    tasks.forEach(task => displayTask(task));
    updateTaskCount();
}

function updateTaskCount() {
    const taskCount = document.querySelector('.task-count');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const remainingTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${remainingTasks} tarefa restante${remainingTasks !== 1 ? 's' : ''}`;
}
