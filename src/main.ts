import { v4 as uuidV4 } from "uuid";

type Task = {
  id: string
  title: string
  completed: boolean
  date: Date
}

const form = document.querySelector('.task-form') as HTMLFormElement;
const title = document.querySelector('.task-title') as HTMLInputElement;
const list = document.querySelector('.task-list') as HTMLUListElement | null;
const storedTasks: Task[] = loadTasks();

storedTasks.forEach(addTask);

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if(title.value == "" || title.value == null) return

  const newTask: Task = {
    id: uuidV4(),
    title: title.value,
    completed: false,
    date: new Date()
  }

  storedTasks.push(newTask);
  storeTasks();
  addTask(newTask);
  title.value = "";
})

function addTask(task: Task) {
  const li = document.createElement("li");
  const deleteBtn = document.createElement("button");
  const checkbox = document.createElement("input");
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    storeTasks();
  })
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  deleteBtn.textContent = "X";
  deleteBtn.addEventListener("click", (event: Event) => deleteTask(event))
  li.append(checkbox, task.title, deleteBtn);
  li.setAttribute("id", task.id);
  list?.append(li);
}

function deleteTask (event: Event) {
  const listItem = (event.target as HTMLButtonElement)?.parentElement;

  if (listItem) {
    const taskId = listItem.getAttribute('id');
    const tasks = JSON.parse(localStorage.getItem("Task") || "[]");
    const taskIndex = tasks.findIndex((task: Task) => task.id === taskId);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      localStorage.setItem("Task", JSON.stringify(tasks));
    }
    list?.removeChild(listItem);
  }
}

function storeTasks() {
  localStorage.setItem("Task", JSON.stringify(storedTasks));
}

function loadTasks(): Task[] {
  const task = localStorage.getItem("Task");
  if(task == "" || task == null) return []
  return JSON.parse(task);
}

