
import os
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from services.ai import AIService
from api.routes import harvester
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="RBOS Logic Core v25")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Neural Matrix with Multi-Key Support
api_keys = [os.getenv("API_KEY")]
app.state.ai = AIService(api_keys=api_keys)

# Register Sub-Nodes
app.include_router(harvester.router, prefix="/api/harvester")

@app.get("/api/status")
async def get_status():
    return {
        "status": "operational",
        "node": "LOGIC_CORE_V25",
        "uplink": "ACTIVE",
        "matrix": "SYNCHRONIZED"
    }

@app.post("/api/gemini-chat")
async def chat(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "")
    system_instruction = data.get("systemInstruction", "")
    response = await app.state.ai.generate_response(prompt)
    return {"success": True, "text": response}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=3001)
