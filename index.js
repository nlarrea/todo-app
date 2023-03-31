const todoInput = document.querySelector('#todo-input');
const placeholder = document.querySelector('#placeholder');
const addBtn = document.querySelector('#btn-add');
const filterTodos = document.querySelector('#filter-todos');

const todosWrapper = document.querySelector('#todos-wrapper');


document.addEventListener('DOMContentLoaded', getLocalTodos);
console.log(document.addEventListener('DOMContentLoaded', getLocalTodos));
addBtn.addEventListener('click', addTodo);
todosWrapper.addEventListener('click', deleteCheck);



// ADDING NEW TODO

function addTodo(e) {
    e.preventDefault();

    if (!todoInput.value) {
        alert('You should write something before adding it!');
    } else {
        // create <p> and buttons
        let newP = document.createElement('p');
        newP.classList.add('todo-text')
        newP.innerText = todoInput.value;

        let newCompleted = document.createElement('button');
        newCompleted.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        newCompleted.classList.add('btn-completed');

        let newRemove = document.createElement('button');
        newRemove.innerHTML = '<i class="fa-solid fa-trash"></i>';
        newRemove.classList.add('btn-remove');

        // create <li>
        let newTodoItem = document.createElement('li');
        newTodoItem.classList.add('todo-item-wrapper');

        // add <p> and buttons to <li>
        newTodoItem.appendChild(newP);
        newTodoItem.appendChild(newCompleted);
        newTodoItem.appendChild(newRemove);

        // add <li> to <ul>
        todosWrapper.appendChild(newTodoItem);

        saveLocalTodos(newP.innerText);
        todoInput.value = '';
    }
}
    


// REMOVING TODO

function deleteCheck(e) {
    const item = e.target;

    if (item.classList.contains('btn-remove')) {
        const todo = item.parentElement;
        todo.classList.add('slide');

        removeLocalTodos(todo.children[0].innerText);
        todo.addEventListener('transitionend', function() {
            todo.remove();
        })
    }

    if (item.classList.contains('btn-completed')) {
        const todo = item.parentElement;
        todo.classList.toggle('todo-completed');
    }
}



// FILTER ELEMENTS

filterTodos.addEventListener('change', e => {
    const todos = todosWrapper.childNodes;

    todos.forEach(todo => {       
        if ((e.target.value === 'all') ||
        (e.target.value === 'completed' && todo.classList.contains('todo-completed')) ||
        (e.target.value === 'incompleted' && !todo.classList.contains('todo-completed'))) {
            todo.style.display = 'flex';
        } else {
            todo.style.display = 'none';
        }
    })
});



function getLocalTodos() {
    let todos;

    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.forEach(todo => {
        // create <p> and buttons
        let newP = document.createElement('p');
        newP.classList.add('todo-text')
        newP.innerText = todo;

        let newCompleted = document.createElement('button');
        newCompleted.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        newCompleted.classList.add('btn-completed');

        let newRemove = document.createElement('button');
        newRemove.innerHTML = '<i class="fa-solid fa-trash"></i>';
        newRemove.classList.add('btn-remove');

        // create <li>
        let newTodoItem = document.createElement('li');
        newTodoItem.classList.add('todo-item-wrapper');

        // add <p> and buttons to <li>
        newTodoItem.appendChild(newP);
        newTodoItem.appendChild(newCompleted);
        newTodoItem.appendChild(newRemove);

        // add <li> to <ul>
        todosWrapper.appendChild(newTodoItem);
    })
}



function saveLocalTodos(todo) {
    let todos;

    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}



function removeLocalTodos(todo) {
    let todos;

    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.splice(todos.indexOf(todo), 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}