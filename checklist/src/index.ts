/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { CheckpointDescriptor } from '../../src/onboarding/checkpoints';
import { getElement } from '../../src/db/actions';

console.info('"Checklist" script started successfully')

const checklist = document.querySelector(".checklist") as HTMLElement;
const itemsLeftElement = document.querySelector("#items-left") as HTMLElement;

const allBtn = document.querySelector("#all") as HTMLElement;
const activeBtn = document.querySelector("#active") as HTMLElement;
const completedBtn = document.querySelector("#completed") as HTMLElement;

const mAllBtn = document.querySelector("#m-all") as HTMLElement;
const mActiveBtn = document.querySelector("#m-active") as HTMLElement;
const mCompletedBtn = document.querySelector("#m-completed") as HTMLElement;

interface Todos {
  id: number;
  isComplete: boolean;
  text: string;
}

let todos: Todos[] = [];

const fetchTodos = () => {
  getElement('todos', 'all').then((todos) => {
      console.log('To-dos:', todos);
      // Render these to-dos on the UI
  }).catch(console.error);
};

// Waiting for the API to be ready
WA.onInit().then(() => {
  async function process() {
    // we initialize the 2 fields values and prepare the submission
    if (itemsLeftElement) {
      allBtn.addEventListener("click", () => {
        allBtn.classList.add("active");
        mAllBtn.classList.add("active");
        activeBtn.classList.remove("active");
        mActiveBtn.classList.remove("active");
        completedBtn.classList.remove("active");
        mCompletedBtn.classList.remove("active");
        filterTodoList("all");
      });
      
      mAllBtn.addEventListener("click", () => {
        allBtn.classList.add("active");
        mAllBtn.classList.add("active");
        activeBtn.classList.remove("active");
        mActiveBtn.classList.remove("active");
        completedBtn.classList.remove("active");
        mCompletedBtn.classList.remove("active");
        filterTodoList("all");
      });
      
      activeBtn.addEventListener("click", () => {
        allBtn.classList.remove("active");
        mAllBtn.classList.remove("active");
        activeBtn.classList.add("active");
        mActiveBtn.classList.add("active");
        completedBtn.classList.remove("active");
        mCompletedBtn.classList.remove("active");
        filterTodoList("active");
      });
      
      mActiveBtn.addEventListener("click", () => {
        allBtn.classList.remove("active");
        mAllBtn.classList.remove("active");
        activeBtn.classList.add("active");
        mActiveBtn.classList.add("active");
        completedBtn.classList.remove("active");
        mCompletedBtn.classList.remove("active");
        filterTodoList("active");
      });
      
      completedBtn.addEventListener("click", () => {
        allBtn.classList.remove("active");
        mAllBtn.classList.remove("active");
        activeBtn.classList.remove("active");
        mActiveBtn.classList.remove("active");
        completedBtn.classList.add("active");
        mCompletedBtn.classList.add("active");
        filterTodoList("completed");
      });
      
      mCompletedBtn.addEventListener("click", () => {
        allBtn.classList.remove("active");
        mAllBtn.classList.remove("active");
        activeBtn.classList.remove("active");
        mActiveBtn.classList.remove("active");
        completedBtn.classList.add("active");
        mCompletedBtn.classList.add("active");
        filterTodoList("completed");
      });

    }

    bootstrapExtra().then(async () => {
        renderTodoList()
    }).catch(e => console.error(e))
  }

  if (document.readyState === "loading") {
      console.log("DEBUG: Loading hasn't finished yet...")
      document.addEventListener("DOMContentLoaded", process)
  } else {
      console.log("DEBUG: `DOMContentLoaded` has already fired")
      process()
  }        
}).catch(e => console.error(e));

const updateItemsLeft = () => {
  const incompleteItems = todos.filter((todo) => !todo.isComplete);
  itemsLeftElement.textContent = incompleteItems.length.toString();
};

// Filters
function filterTodoList(filterType) {
  let filteredTodos: Todos[] = [];

  switch (filterType) {
    case "all":
      filteredTodos = todos;
      break;
    case "active":
      filteredTodos = todos.filter(function (todo) {
        return !todo.isComplete;
      });
      break;
    case "completed":
      filteredTodos = todos.filter(function (todo) {
        return todo.isComplete;
      });
      break;
  }

  renderFilteredTodoList(filteredTodos);
}

function renderFilteredTodoList(filteredTodos) {
  checklist.innerHTML = "";

  filteredTodos.forEach((todo, index) => {
    const newTodoItem = document.createElement("li");
    newTodoItem.className = "card todo-item";
    newTodoItem.setAttribute("data-index", index);

    const todoContent = `
        <div class="todo">
          <input type="checkbox" id="checkbox-${todo.id}" ${
      todo.isComplete ? "checked" : ""
    }>
          <label for="checkbox-${todo.id}"></label>
          <p>${todo.text}</p>
        </div>
        <div class="icons"> 
          <i class="fa fa-pencil" aria-hidden="true"></i>
          <i class="fa fa-times" aria-hidden="true"></i>
        </div>
      `;

    newTodoItem.innerHTML = todoContent;
    checklist.appendChild(newTodoItem);
  });
}



// Main function
async function renderTodoList() {
  console.log("**************************")

  const playerCheckpointIds = await WA.player.state.loadVariable(`checkpoints`) as string[]
  console.log("playerCheckpointIds",playerCheckpointIds)

  const playerCheckpoints = fetchTodos()
  console.log("todos",playerCheckpoints)

  // playerCheckpoints.forEach(checkpoint => {
  //   const passed = (WA.player.state.checkpoints as string[]).includes(checkpoint.id);
  //     // Push the title of each checkpoint to the todos array
  //     todos.push({
  //       id: parseInt(checkpoint.id),
  //       isComplete: passed,
  //       text: checkpoint.title
  //     });
  // });

  console.log("todos",todos)

  checklist.innerHTML = "";

  todos.forEach((todo, index) => {
    const newTodoItem = document.createElement("li");
    newTodoItem.className = "card todo-item ";
    newTodoItem.setAttribute("data-index", index.toString());

    const todoContent = `
      <div class="todo">
        <input type="checkbox" id="checkbox-${todo.id}" ${
      todo.isComplete ? "checked" : ""
    }>
        <label for="checkbox-${todo.id}"></label>
        <p>${todo.text}</p>
      </div>
      <div class="icons"> 
        <i class="fa fa-pencil" aria-hidden="true"></i>
        <i class="fa fa-times" aria-hidden="true"></i>
      </div>
    `;

    newTodoItem.innerHTML = todoContent;
    checklist.appendChild(newTodoItem);
  });

  updateItemsLeft();
}

export {}
