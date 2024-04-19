/// <reference types="@workadventure/iframe-api-typings" />

import { Checklist } from "../../src/Onboarding/Types/Checkpoints";

window.onload = async () => {
    try {
        WA.onInit().then(async () => {
            const checklist = await WA.player.state.checklist as Checklist[];
            renderTodoList(checklist);
        })
    } catch (error) {
        console.error("Error fetching todos from WA API:", error);
    }
};

function renderTodoList(checklist: Checklist[]) {
    const nextCheckpointId = getNextCheckpointId(checklist);
    const filterRadios = document.querySelectorAll('input[name="filter"]') as NodeListOf<HTMLInputElement>
    filterRadios.forEach(radio => {
        radio.addEventListener('change', () => filterTodoList(checklist, nextCheckpointId, radio.value));
    });

    filterTodoList(checklist, nextCheckpointId);
}

function filterTodoList(checklist: Checklist[], nextCheckpointId: string, filter: string = "notDone") {
    const allCountSpan = document.querySelector('.all-count') as HTMLSpanElement;
    allCountSpan.textContent = checklist.length.toString();

    const doneCount = checklist.filter(todo => todo.done).length;
    const doneCountSpan = document.querySelector('.done-count') as HTMLSpanElement;
    doneCountSpan.textContent = doneCount.toString();

    const notDoneCount = checklist.filter(todo => !todo.done).length;
    const notDoneCountSpan = document.querySelector('.not-done-count') as HTMLSpanElement;
    notDoneCountSpan.textContent = notDoneCount.toString();

    const filteredTodos = filter === 'done' ? checklist.filter(todo => todo.done) :
        filter === 'notDone' ? checklist.filter(todo => !todo.done) :
            checklist;

    const todoListContainer = document.querySelector('.todo-list') as HTMLUListElement;
    todoListContainer.innerHTML = '';

    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        if (todo.done) {
            todoItem.classList.add('done');
        }
        if (todo.id === nextCheckpointId) {
            todoItem.classList.add('next');
        }
        todoItem.textContent = todo.title;
        todoListContainer.appendChild(todoItem);
    });
}

// We duplicate the 'checkopints.ts' function here because we can't call it from this iframe...
function getNextCheckpointId(checklist: Checklist[]): string {
    // Find the first checklist item that is not done
    const nextCheckpoint = checklist.find(checkpoint => !checkpoint.done);

    // If a next checkpoint is found, return its ID; otherwise, return -1
    return nextCheckpoint ? nextCheckpoint.id : "-1";
}