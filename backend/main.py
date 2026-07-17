from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4

app = FastAPI()

class TodoCreate(BaseModel):
    text: str
    completed: bool = False

todos = []

@app.post("/todos",status_code=201)
async def create_todo(todo: TodoCreate):
    todo_data = todo.model_dump() ##why model_dump()?
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