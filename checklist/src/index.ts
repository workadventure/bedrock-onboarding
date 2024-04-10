/// <reference types="@workadventure/iframe-api-typings" />

import { Checklist } from "../../src/onboarding/checkpoints";

window.onload = async () => {
    try {
        const checklist = await WA.player.state.checklist as Checklist[];
        const checkpointIds = await WA.player.state.checkpointIds as string[];
        renderTodoList(checklist, checkpointIds);
    } catch (error) {
        console.error("Error fetching todos from WA API:", error);
    }
};

function renderTodoList(checklist: Checklist[], checkpointIds: string[]) {
    const nextCheckpointId = getNextCheckpointId(checkpointIds);
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
function getNextCheckpointId(playerCheckpointIds: string[]): string {
    // if player just started the game
    if (playerCheckpointIds.length === 1 && playerCheckpointIds[0] === "0") {
        return "1"
    }
    // Convert string elements to numbers
    const numericCheckpointIds: number[] = playerCheckpointIds.map(Number);
    // Sort the array in order to analyze the sequence
    numericCheckpointIds.sort((a, b) => a - b);

    let startIdx = numericCheckpointIds.indexOf(1); // Find the index of the first occurrence of 1
    if (startIdx === -1) {
        // No sequence beginning with 1 found
        return "-1";
    }

    // Iterate from the start index to find the end of the sequence
    let endIdx = startIdx;
    while (endIdx + 1 < numericCheckpointIds.length && numericCheckpointIds[endIdx + 1] === numericCheckpointIds[endIdx] + 1) {
        endIdx++;
    }

    // Return the last number (maximum) of the consecutive sequence starting from 1 to the latest uninterrupted number and add 1 to get the next
    return (numericCheckpointIds[endIdx] + 1).toString()
}