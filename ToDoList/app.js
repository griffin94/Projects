const input = document.getElementById("task-input");
const addButton = document.getElementById("add-task-btn");
const removeButton = document.getElementById("remove-task-btn");
const removeAllButton = document.getElementById("remove-all-button");
const sortButton = document.getElementById("sort-button");
let tasks = new Array();

loadTasks();

input.addEventListener("blur", function () {
  if (this.value.length != 0) {
    removeError(this);
    enableButton(addButton);
  } else {
    return;
    /*
        setError(this);
        disableButton(button);
        */
  }
});

addButton.addEventListener("click", function () {
  event.preventDefault();
  if (input.value.length != 0) {
    removeError(input);
    enableButton(this);
    tasks.push(formatText(input.value));
    addTask(tasks);
    input.value = "";
    input.focus();
  } else {
    setError(input);
    disableButton(this);
  }
});

removeButton.addEventListener("click", function () {
  const tasks = Array.from(document.querySelectorAll('input[type="checkbox"]'));
  const checkedTasks = tasks.filter((checkbox) => checkbox.checked);

  if (checkedTasks.length != 0) {
    enableButton(this);
    removeTask(checkedTasks);
  } else {
    disableButton(this);
    document.querySelector(".remove-task-btn-validation").textContent =
      "Select tasks";
  }
});

removeAllButton.addEventListener("click", removeAll);

sortButton.addEventListener("click", sortTasks);

function setError(input) {
  input.classList.add("error");
  input.nextElementSibling.textContent = "Provide the task name";
}

function removeError(item) {
  input.classList.remove("error");
  input.nextElementSibling.textContent = "";
}

function disableButton(button) {
  button.classList.add("disabled");
}

function enableButton(button) {
  button.classList.remove("disabled");
}

function formatText(text) {
  const word = text.trim();
  const formatedText =
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  return formatedText;
}

function addTask(tasks) {
  window.localStorage.setItem("Tasks", JSON.stringify(tasks));
  const ul = document.querySelector(".task-list");
  ul.textContent = "";
  const lis = Array.from(document.getElementsByTagName("li"));
  lis.forEach((li) => {
    li.parentElement.removeChild(li);
  });

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");

    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", index);

    li.classList.add("task");
    li.textContent = `${index + 1}. ${task}`;
    li.addEventListener("click", checkTask);

    li.appendChild(checkbox);
    ul.appendChild(li);
  });
}

function removeTask(checkedTasks) {
  window.localStorage.clear();
  for (let i = checkedTasks.length - 1; i >= 0; i--) {
    tasks.splice(checkedTasks[i].id, 1);
  }
  if (tasks.length != 0) {
    addTask(tasks);
  } else {
    const tasksList = document.querySelector(".task-list");
    tasksList.innerText = "It looks like you have a lazy day....";
  }
}

function removeAll() {
  tasks = [];
  window.localStorage.clear();
  const lis = Array.from(document.getElementsByTagName("li"));
  lis.forEach((item) => {
    item.parentElement.removeChild(item);
  });
  const tasksList = document.querySelector(".task-list");
  tasksList.innerText = "It looks like you have a lazy day....";
}

function loadTasks() {
  if (window.localStorage.length != 0) {
    tasks = JSON.parse(window.localStorage.getItem("Tasks"));
    addTask(tasks);
  } else {
    return;
  }
}

function checkTask() {
  this.classList.toggle("checked");
  const checkbox = this.querySelector("input");
  enableButton(removeButton);
  document.querySelector(".remove-task-btn-validation").textContent = "";

  if (checkbox.checked) {
    checkbox.checked = false;
  } else {
    checkbox.checked = true;
  }
}

function sortTasks() {
  tasks.sort();
  addTask(tasks);
}
