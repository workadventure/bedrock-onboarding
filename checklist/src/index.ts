/// <reference types="@workadventure/iframe-api-typings" />

window.onload = async () => {
    try {
        const todoList = await WA.player.state.checklist;
        renderTodoList(todoList);
    } catch (error) {
        console.error("Error fetching todos from WA API:", error);
    }
};

function renderTodoList(todoList) {
    const filterRadios = document.querySelectorAll('input[name="filter"]') as NodeListOf<HTMLInputElement>
    filterRadios.forEach(radio => {
        radio.addEventListener('change', () => filterTodoList(todoList, radio.value));
    });

    filterTodoList(todoList, 'notDone');
}

function filterTodoList(todoList, filter) {
    const allCountSpan = document.querySelector('.all-count') as HTMLSpanElement;
    allCountSpan.textContent = todoList.length;

    const doneCount = todoList.filter(todo => todo.done).length;
    const doneCountSpan = document.querySelector('.done-count') as HTMLSpanElement;
    doneCountSpan.textContent = doneCount;

    const notDoneCount = todoList.filter(todo => !todo.done).length;
    const notDoneCountSpan = document.querySelector('.not-done-count') as HTMLSpanElement;
    notDoneCountSpan.textContent = notDoneCount;

    const filteredTodos = filter === 'done' ? todoList.filter(todo => todo.done) :
        filter === 'notDone' ? todoList.filter(todo => !todo.done) :
            todoList;

    const todoListContainer = document.querySelector('.todo-list') as HTMLUListElement;
    todoListContainer.innerHTML = '';

    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        if (todo.done) {
            todoItem.classList.add('done');
        }
        todoItem.textContent = todo.title;
        todoListContainer.appendChild(todoItem);
    });
}