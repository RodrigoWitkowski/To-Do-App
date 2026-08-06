from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from uuid import uuid4

app = FastAPI()

class TodoCreate(BaseModel): #referencing BaseModel (pydantic class) so TodoCreate inherits its atributes and methods. FastAPI uses BaseModel to validate the request, otherwise returns 422
    text: str = Field(min_length=1, max_length=200)
    completed: bool = False

todos = []

@app.post("/todos",status_code=201)
async def create_todo(todo: TodoCreate): #FastAPI enforces todo to follow TodoCreate format (this is where the validation happends)
    todo_data = todo.model_dump()
    todo_data["id"] = str(uuid4())

    todos.append(todo_data)
    return todo_data

@app.get("/")
async def root():
    return {"message": "Todo API is running"}

@app.get("/todos", status_code=200)
async def getTodos():
    return todos

@app.get("/todos/{todo_id}", status_code=200)
async def get_todo(todo_id: str):
    for todo in todos:
        if todo["id"] == todo_id:
            return todo
    
    raise HTTPException(status_code=404, detail="Todo not found")

@app.delete("/todos/{todo_id}", status_code=200)
async def delete_todo(todo_id: str):
    for todo in todos:
        if todo["id"] == todo_id:
            todos.remove(todo)
            return todo
    
    raise HTTPException(status_code=404, detail="Todo not found")

class TodoUpdate(BaseModel):
    text: str | None = None
    completed: bool | None = None

@app.patch("/todos/{todo_id}", status_code=200)
async def update_todo(todo_id: str, changes: TodoUpdate):
    for todo in todos:
        if todo["id"] == todo_id:
            update_data = changes.model_dump(exclude_unset=True)
            todo.update(update_data)
            return todo
            
    raise HTTPException(status_code=404, detail="Todo not found")