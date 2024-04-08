/// <reference types="@workadventure/iframe-api-typings" />
console.log('Town script started successfully');

import { addElement } from './db/actions';

export function initTown() {
    addTodo("coucou")
}

const addTodo = (title: string) => {
    const newTodo = { title, done: false };
    addElement('todos', newTodo).then(() => {
        console.log('New to-do added:', title);
        // Optionally, refresh the to-do list on the UI
    }).catch(console.error);
};