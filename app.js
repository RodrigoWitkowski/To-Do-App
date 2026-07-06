const todoForm = document.querySelector( 'form'); //querySelector gets the form element from index.html
const todoInput = document.getElementById('todo-input'); //getElementById gets the todo-input element from index.html
const todoListUL = document.getElementById('todo-list'); //getElementById gets the todo-list element from index.html

let allTodos = getTodos(); // Array of objects that stores the current todo list loaded from localStorage so multiple functions can use and update it
updateTodoList(); //Renders todo list elements in html based on allTodos array

todoForm.addEventListener('submit', function(e){ //runs this callback function (fuction(e)) when form is submitted
    e.preventDefault(); //prevents default behavior, in this case, reloading the page when form is submitted. Needed because addTodo(function) uses todoInput element, if the page reloaded, the input would be wiped.
    addTodo(); //adds todos to allTodos
})

function addTodo() { //adds todos to allTodos
    const todoText= todoInput.value.trim(); //stores trimmed todo task title input (ex. "finish project")
    if (todoText.length > 0) { //checks if todoText has content after trim
        const todoObject = { //defines todoObject with todoText and completed boolean variable (if the task is completed or not)
            text: todoText,
            completed: false
        }
        allTodos.push(todoObject); //adds todoObject with todoText and completed:false  properties to allTodos
        updateTodoList(); //renders todo list elements
        saveTodos(); //stores todos information to local storage
        todoInput.value=""; //resets input element value
    }
}
function updateTodoList(){ //renders todo list elements
    todoListUL.innerHTML = ""; //defines todoListUL as empty HTML element
    allTodos.forEach((todo, todoIndex)=>{ //runs once for each todo in the array (needs todo's array index to run)
        const todoItem = createTodoItem(todo, todoIndex); //so for each todo, a todoItem (HTML todo element) is created
        todoListUL.append(todoItem); //each todoItem created is added to todoListUL

    }) 
}
function createTodoItem(todo, todoIndex){ //creates individual todo HTML elements
    const todoId = "todo-"+todoIndex;
    const todoListItem = document.createElement("li");
    const todoText = todo.text
    todoListItem.className = "todo"
    todoListItem.innerHTML = `    
                <input type="checkbox" id="${todoId}">
                <label class="custom-checkbox" for="${todoId}">
                    <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
                </label>
                <label class="todo-text" for="${todoId}">
                    ${todoText}
                </label>
                <button class="delete-button">
                    <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                         <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
    `
    const deleteButton = todoListItem.querySelector(".delete-button");
    deleteButton.addEventListener("click", ()=>{
        deleteTodoItem(todoIndex);
    })
    const checkbox = todoListItem.querySelector("input");
    checkbox.addEventListener("change", ()=>{
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
    })
    checkbox.checked = todo.completed;
    return todoListItem;
}
function deleteTodoItem(todoIndex){
    allTodos = allTodos.filter((_, i)=> i !== todoIndex);
    saveTodos();
    updateTodoList();
}
function saveTodos(){
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson);
}
function getTodos(){
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}