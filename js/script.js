document.addEventListener('DOMContentLoaded', init);

async function init() {

    let userName = localStorage.getItem('userName');
    if (userName === null || userName === '') {
        userName = prompt('Digite seu usuário do GitHub:');
        localStorage.setItem('userName', userName);
    }

    await fetchRepositories(userName);
    restoreTasks();
    document.querySelector('.btn-task').addEventListener('click', toggleModal);
    document.querySelector('.btn-close').addEventListener('click', toggleModal);
    document.querySelector('.form-task').addEventListener('submit', addTask);
}

async function fetchRepositories(userName) {
    try {
        const response = await fetch(`https://api.github.com/users/${userName}/repos`);
        const repos = await response.json();
        const selectElement = document.getElementById('task-repo');
        repos.forEach(repo => {
            let option = document.createElement('option');
            option.value = repo.html_url;
            option.textContent = repo.name;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao buscar repositórios:', error);
    }
}

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
        repo: document.getElementById('task-repo').value
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
    li.setAttribute('data-task-id', task.id); // Adiciona um identificador único a cada tarefa para facilitar manipulações futuras
    if (task.completed) {
        li.classList.add('completed');
    }
    let repoName = task.repo.split('/').pop();
    task.date = new Date(task.date).toLocaleDateString('pt-BR');
    li.innerHTML = `
        <div class="task-content">
            <p class="task-title">${task.title}</p>
            <p class="task-description">${task.description}</p>
            <div class="task-details">
                <span class="task-tag"><i class="fas fa-tags"></i>${task.tag}</span>
                <span class="task-date">${task.date}</span>
                <a href="${task.repo}" target="_blank" class="task-repo">
                    <i class="fab fa-github"></i>
                    ${repoName}
                </a>
            </div>
        </div>
        <div class="task-actions">
            <button class="btn-delete" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash-alt"></i>
            </button>
            ${!task.completed ? `<button class="btn-conclude" onclick="concludeTask(${task.id})">Concluir tarefa</button>` : ''}
        </div>
    `;

    // Inserindo tarefas não concluídas no início e tarefas concluídas no final
    if (task.completed) {
        taskList.appendChild(li); // Adiciona tarefas concluídas ao final
    } else {
        taskList.prepend(li); // Adiciona tarefas não concluídas ao início
    }
    updateTaskCount();
}

function restoreTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Ordenando tarefas: primeiro as não concluídas, depois as concluídas
    tasks.sort((a, b) => a.completed - b.completed);
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
    taskCount.textContent = `${remainingTasks} tarefa(s) restante(s)`;
}
