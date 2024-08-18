const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const folderList = document.getElementById("folderList");

function saveTasks() {
    const folderData = folderList.innerHTML;
    localStorage.setItem('folderData', folderData);
}

function loadTasks() {
    const savedData = localStorage.getItem('folderData');
    if (savedData) {
        folderList.innerHTML = savedData;

        document.querySelectorAll('.folder-header').forEach(header => {
            const deleteBtn = header.querySelector('span');
            const checkbox = header.querySelector('.checkbox');
            const folder = header.parentElement;

            header.addEventListener('click', (e) => {
                if (e.target !== deleteBtn && e.target !== checkbox) {
                    folder.classList.toggle('open');
                }
            });

            checkbox.addEventListener('click', () => {
                folder.classList.toggle('checked');
                saveTasks();
            });

            deleteBtn.addEventListener('click', () => {
                folder.remove();
                saveTasks();
            });
        });

        document.querySelectorAll('li span').forEach(span => {
            span.addEventListener('click', () => {
                span.parentElement.remove();
                saveTasks();
            });
        });

        document.querySelectorAll('.checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', () => {
                checkbox.parentElement.parentElement.classList.toggle('checked');
                saveTasks();
            });
        });
    }
}

function createFolderElement(folderName) {
    const folder = document.createElement('li');
    folder.id = folderName;
    folder.className = 'folder';

    const folderHeader = document.createElement('div');
    folderHeader.textContent = folderName;
    folderHeader.className = 'folder-header';

    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox';
    folderHeader.prepend(checkbox);

    const deleteBtn = document.createElement('span');
    deleteBtn.innerHTML = "\u00d7";
    folderHeader.appendChild(deleteBtn);

    folder.appendChild(folderHeader);

    const taskList = document.createElement('ul');
    taskList.className = 'task-list';
    folder.appendChild(taskList);

    folderHeader.addEventListener('click', (e) => {
        if (e.target !== deleteBtn && e.target !== checkbox) {
            folder.classList.toggle('open');
        }
    });

    checkbox.addEventListener('click', () => {
        folder.classList.toggle('checked');
        saveTasks();
    });

    deleteBtn.addEventListener('click', () => {
        folder.remove();
        saveTasks();
    });

    return folder;
}

function addTask() {
    const taskValue = taskInput.value.trim();

    if (taskValue === '') {
        alert("You must write something!");
        return;
    }

    const pathParts = taskValue.split('/');
    const taskName = pathParts.pop();

    let currentFolder = folderList;

    pathParts.forEach(folderName => {
        let folder = currentFolder.querySelector(`#${folderName}`);

        if (!folder) {
            folder = createFolderElement(folderName);
            currentFolder.appendChild(folder);
        }

        currentFolder = folder.querySelector('.task-list');
    });

    if (taskName) {
        const taskItem = document.createElement('li');
        taskItem.textContent = taskName;

        if (taskName.includes(':')) {
            taskItem.classList.add('centered-task');
        } else {
            const span = document.createElement("span");
            span.innerHTML = "\u00d7";
            taskItem.appendChild(span);

            span.addEventListener('click', () => {
                taskItem.remove();
                saveTasks();
            });
        }

        currentFolder.appendChild(taskItem);
    }

    taskInput.value = '';
    saveTasks();
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

folderList.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveTasks();
    } else if (e.target.classList.contains("checkbox")) {
        e.target.parentElement.parentElement.classList.toggle("checked");
        saveTasks();
    }
}, false);

loadTasks();
