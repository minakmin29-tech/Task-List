const taskInput = document.querySelector("#task");

document.addEventListener("DOMContentLoaded", function() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    for (const element of tasks) {
        addTask(element.id, element.title);
    }
})

document.querySelector("#task-form").addEventListener("submit", function(e) {
    e.preventDefault();
    if (validateField() === false) {
        return;
    };
    const taskID = addTasksToLS();
    addTask(taskID, taskInput.value);
});

function validateField() {
    if (taskInput.value === "") {
        alert("Введите текст задачи");
        return false;
    } else {
        return true;
    }
};

function addTask(taskID, title) {
    if (!document.querySelector(".card-action")) {
        createBox();

        document.querySelector(".collection").addEventListener("click", deleteTask);

        document.querySelector(".clear-tasks").addEventListener("click", function(e) {
            e.preventDefault();
            if (confirm("Are you sure?")) {
                localStorage.removeItem("tasks");
                document.querySelector(".card-action").remove();
            };
        });

        document.querySelector("#filter").addEventListener("input", function(e) {
            filterTasks(e);
        });
    };


    document.querySelector(".collection").insertAdjacentHTML("beforeend", `
            <li class="collection-item" data-id="${taskID}">
            ${title}
            <a href="#" class="delete-item secondary-content">
                <i class="fa fa-remove"></i>
            </a>
        </li>`);

    taskInput.value = "";
};

function addTasksToLS() {
    let tasks = JSON.parse(localStorage.getItem("tasks"));

    if (!tasks) {
        tasks = [];
    };

    let taskID = 1;

    if (tasks.length > 0) {
        taskID = tasks[tasks.length - 1].id + 1
    }
    
    const task = {
        id: taskID,
        title: taskInput.value,
    }
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    return taskID
}

function removeTasksFromLS(li) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (!tasks || tasks.length === 0) {
        return
    }

    const id = li.dataset.id;
    tasks.forEach(function(task, index, tasks) {
        if (task.id === +id) {
            tasks.splice(index, 1);
        }
    });
    

    localStorage.setItem("tasks", JSON.stringify(tasks));
};



function deleteTask(e) {

    if (e.target.matches(".delete-item")) {
        
        removeTasksFromLS(e.target.parentElement);
        e.target.parentElement.remove();
    } else if (e.target.matches(".fa-remove")) {

        removeTasksFromLS(e.target.parentElement.parentElement);

        e.target.parentElement.parentElement.remove();
    }

    if (document.querySelector(".collection").children.length === 0) {
        document.querySelector(".card-action").remove();
    }
};

function createBox() {
    document.querySelector(".container").insertAdjacentHTML("beforeend", `
    <div class="card-action">
        <h5 id="task-title">Tasks</h5>
            <div class="input-field col s12">
                <input type="text" name="filter" id="filter">
                <label for="filter">Filter Tasks</label>
            </div>
        <h5 id="notTasks" class="hide">Нет задачи</h5>
        <ul class="collection">

        </ul>
        <a class="clear-tasks btn black" href="">Clear Tasks</a>
    </div>`);
};

function filterTasks(e) {
    const term = e.target.value;

    let hasMatch = false;

    const li = document.querySelectorAll("li");
    for (const liElem of li) {
        
        if (liElem.textContent.trim().toLowerCase().includes(term.toLowerCase()) === false) {
            liElem.classList.add("hide");
        } else {
            liElem.classList.remove("hide");
            hasMatch = true;
        }
    }
    if (!hasMatch) {
        document.querySelector("#notTasks").classList.remove("hide");
    } else {
        document.querySelector("#notTasks").classList.add("hide");
    }
};