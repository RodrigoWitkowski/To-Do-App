from fastapi import FastAPI
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

