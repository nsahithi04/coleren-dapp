from fastapi import FastAPI
from pydantic import BaseModel
from main import run_agent
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.post("/ask")
async def ask(req: QueryRequest):
    result = run_agent(req.query)

    if isinstance(result, list):
        result = result[0].get("text", "")
    elif isinstance(result, dict):
        result = result.get("text", str(result))

    return {"response": result}

