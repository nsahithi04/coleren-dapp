import os
from fastapi import FastAPI
from pydantic import BaseModel
from main import run_agent
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.get("/health")
async def health():
    return {"ok": True}

@app.post("/ask")
async def ask(req: QueryRequest):
    result = run_agent(req.query)

    if isinstance(result, list):
        result = result[0].get("text", "")
    elif isinstance(result, dict):
        result = result.get("text", str(result))

    return {"response": result}
