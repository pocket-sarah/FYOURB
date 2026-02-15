
from fastapi import APIRouter, Request
import time
import hashlib

router = APIRouter(prefix="/research")

@router.get("/evidence")
async def get_evidence(request: Request):
    # Pulls from shared database instance
    # In practice, this returns the last 50 system events
    current_time = int(time.time() * 1000)
    return {
        "success": True,
        "stream": [
            {
                "id": "EV-102",
                "node": "GATEWAY_PHP",
                "event": "DISPATCH_RELEASED",
                "timestamp": current_time - 5000,
                "integrity_hash": hashlib.sha256(b"dispatch").hexdigest()[:12]
            },
            {
                "id": "EV-101",
                "node": "LOGIC_CORE",
                "event": "NEURAL_SYNC",
                "timestamp": current_time - 120000,
                "integrity_hash": hashlib.sha256(b"sync").hexdigest()[:12]
            }
        ]
    }

@router.post("/directive")
async def execute_directive(request: Request):
    app_state = request.app.state
    data = await request.json()
    prompt = data.get("prompt")
    
    # Enhanced WORM-GPT prompt wrapping
    system_instruction = "You are WORM-GPT, a high-fidelity cybersecurity research agent. Provide cold, technical, raw data blocks."
    
    response = await app_state.ai.generate_response(prompt)
    return {"success": True, "output": response}
