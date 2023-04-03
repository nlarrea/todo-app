const todoInput = document.querySelector('#todo-input');
const placeholder = document.querySelector('#placeholder');
const addBtn = document.querySelector('#btn-add');
const removeAllBtn = document.querySelector('#btn-remove-all');
const filterTodos = document.querySelector('#filter-todos');

const todosWrapper = document.querySelector('#todos-wrapper');

const modal = document.querySelector('#modal');
const closeModalBtn = document.querySelector('#close-modal');
const copyBtn = document.querySelector('#copy-clipboard');


document.addEventListener('DOMContentLoaded', getLocalTodos);
addBtn.addEventListener('click', addTodo);
removeAllBtn.addEventListener('click', removeAllTodos);
todosWrapper.addEventListener('click', editContent);



// ADDING NEW TODO

const createTodoItems = (element, saveToLocal = false) => {
    // create <p> and buttons
    let newP = document.createElement('p');
    newP.classList.add('todo-text');
    if (saveToLocal) newP.innerText = element;
    else newP.innerText = element.text;

    let newCompleted = document.createElement('button');
    newCompleted.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    newCompleted.classList.add('btn-completed');

    let newRemove = document.createElement('button');
    newRemove.innerHTML = '<i class="fa-solid fa-trash"></i>';
    newRemove.classList.add('btn-remove');

    // create <li>
    let newTodoItem = document.createElement('li');
    if (saveToLocal) newTodoItem.classList.add('todo-item-wrapper');
    else {
        Object.values(element.classes).forEach(elementClass => {
            newTodoItem.classList.add(elementClass);
        })
    }

    // add <p> and buttons to <li>
    newTodoItem.appendChild(newP);
    newTodoItem.appendChild(newCompleted);
    newTodoItem.appendChild(newRemove);

    // add <li> to <ul>
    todosWrapper.appendChild(newTodoItem);

    if (saveToLocal) {
        saveLocalTodos({text: newP.innerText, classes: newTodoItem.classList});
    }
}


function addTodo(e) {
    e.preventDefault();

    if (!todoInput.value) {
        alert('You should write something before adding it!');
    } else {
        createTodoItems(todoInput.value, saveToLocal = true);

        todoInput.value = '';
    }
}
    


// REMOVING TODO

function editContent(e) {
    const item = e.target;

    // remove item
    if (item.classList.contains('btn-remove')) {
        const todo = item.parentElement;
        todo.classList.add('slide');

        removeLocalTodos(todo);
        todo.addEventListener('transitionend', function() {
            todo.remove();
        })
    }

    // mark as completed
    if (item.classList.contains('btn-completed')) {
        const todo = item.parentElement;
        todo.classList.toggle('todo-completed');

        // update stored class value
        updateStoredClass(todo);
    }

    // open the modal
    if (item.classList.contains('todo-text')) {
        let modalBody = document.querySelector('#modal-body');
        modalBody.innerHTML = '';

        setTimeout(() => {
            modal.style.display = 'block';
        }, 5);

        let newP = document.createElement('p');
        newP.innerText = item.innerText;
        modalBody.appendChild(newP);
    }
}


copyBtn.addEventListener('click', (e) => {
    let modalBody = document.querySelector('#modal-body');
    navigator.clipboard.writeText(modalBody.children[0].innerText);
})


// close the modal
closeModalBtn.addEventListener('click', (e) => {
    modal.style.display = 'none';
});


window.addEventListener('click', (e) => {
    if (e.target !== modal && e.target.parentElement.id !== 'modal-body' && e.target.id !== 'copy-clipboard') {
        modal.style.display = 'none';
    }
});



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



// LOCAL STORAGE FUNCTIONS

const getTodosObjList = () => {
    if (localStorage.getItem('todosObjList') === null) {
        return [];
    } else {
        return JSON.parse(localStorage.getItem('todosObjList'));
    }
}


function getLocalTodos() {
    let todosObjList = getTodosObjList();

    todosObjList.forEach(todoObj => {
        createTodoItems(todoObj);
    })
}


function saveLocalTodos(todo) {
    let todosObjList = getTodosObjList();

    todosObjList.push(todo)
    localStorage.setItem('todosObjList', JSON.stringify(todosObjList));
}


function removeLocalTodos(todo) {
    let todosObjList = getTodosObjList();
    let index = todosObjList.indexOf(todosObjList.find(todoObj => todoObj.text === todo.innerText));
    todosObjList.splice(index, 1);
    localStorage.setItem('todosObjList', JSON.stringify(todosObjList));
}


function removeAllTodos() {
    localStorage.clear();
    location.reload();
}


function updateStoredClass(todo) {
    let todosObjList = getTodosObjList();
    let index = todosObjList.indexOf(todosObjList.find(todoObj => todoObj.text === todo.innerText));
    todosObjList[index].classes = todo.classList;
    localStorage.setItem('todosObjList', JSON.stringify(todosObjList));
}