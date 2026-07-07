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
    todoListUL.innerHTML = ""; //assigns empty HTML element to todoListUL (UL = unordered list)
    allTodos.forEach((todo, todoIndex)=>{ //runs once for each todo in the array (needs todo's array index to run)
        const todoItem = createTodoItem(todo, todoIndex); //so for each todo, a todoItem (HTML todo element) is created
        todoListUL.append(todoItem); //each todoItem created is added to todoListUL

    }) 
}
function createTodoItem(todo, todoIndex){ //creates individual todo HTML elements
    const todoId = "todo-"+todoIndex; //todo ID logic
    const todoListItem = document.createElement("li"); //creates HTML list item element <li></li>
    const todoText = todo.text //access text property of current todoObject (todo) and saves the value as todoText
    todoListItem.className = "todo" //assigns todoListItem to respective html class
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
    ` //assigns html to todoListUL 
    const deleteButton = todoListItem.querySelector(".delete-button"); //selects the delet button element
    deleteButton.addEventListener("click", ()=>{ //event listener (when button clicked execute deleTodoItem(todoIndex))
        deleteTodoItem(todoIndex);
    })
    const checkbox = todoListItem.querySelector("input"); //gets the first "input" element inside todoListItem
    checkbox.addEventListener("change", ()=>{ //listens for when the checkbox changes state (its a boolean state so we can match with the todoObject property)
        allTodos[todoIndex].completed = checkbox.checked; //when changed, todoObject "completed" property is assigned the checkbox boolean value
        saveTodos(); //save todos in localStorage
    })
    checkbox.checked = todo.completed; //renders checkbox state
    return todoListItem; //returned to be stored in todoItem back in updateTodoList()
}
function deleteTodoItem(todoIndex){ //deletes todo with specific todoIndex (called by createTodoItem() if delete button is clicked)
    allTodos = allTodos.filter((_, i)=> i !== todoIndex); // Create a new array that keeps every todo except the one at todoIndex
    saveTodos(); //save todos in localStorage
    updateTodoList(); //renders updated todos
}
function saveTodos(){ //saves todos in localStorage
    const todosJson = JSON.stringify(allTodos); //converts allTodos array into a json with strings
    localStorage.setItem("todos", todosJson); //saves the JSON in local storage with key "todos" (not one key per todo, but one JSON for all)
}
function getTodos(){ //retrieves JSON from localStorage
    const todos = localStorage.getItem("todos") || "[]"; // gets Items (or if there isnt anything gets empty value)
    return JSON.parse(todos); //converts JSON to object (array in this case) this is assigned to the global variable allTodos at the start of the code
}