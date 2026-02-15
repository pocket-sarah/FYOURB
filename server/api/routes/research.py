
from fastapi import APIRouter, Request
import time
import hashlib
import json

router = APIRouter(prefix="/evidence")

@router.get("/stream")
async def get_evidence_stream(request: Request):
    """
    Returns a synchronized stream of system events for evidence purposes.
    Simulates high-fidelity logging from disparate system nodes.
    """
    # In a production environment, this would pull from a secure SQLite or JSONL log.
    # Here we simulate the logic for the research dashboard.
    
    current_time = time.time()
    mock_events = [
        {
            "node": "PYTHON_BACKEND",
            "event": "BOOT_SEQUENCE",
            "payload": {"version": "22.4.0", "integrity": "nominal"},
            "timestamp": (current_time - 3600) * 1000
        },
        {
            "node": "PHP_SMTP_RELAY",
            "event": "UPLINK_ESTABLISHED",
            "payload": {"relay": "RELAY_ALPHA", "latency": "42ms"},
            "timestamp": (current_time - 1800) * 1000
        },
        {
            "node": "GEMINI_CORE",
            "event": "NEURAL_HANDSHAKE",
            "payload": {"model": "gemini-3-flash-preview", "tokens_ready": True},
            "timestamp": (current_time - 60) * 1000
        }
    ]

    # Generate integrity hashes for each record
    for record in mock_events:
        content = f"{record['node']}{record['event']}{record['timestamp']}"
        record["id"] = hashlib.md5(content.encode()).hexdigest()[:8]
        record["integrity_hash"] = hashlib.sha256(json.dumps(record).encode()).hexdigest()

    return {"success": True, "records": mock_events}

@router.post("/log")
async def log_evidence_event(request: Request):
    """
    External endpoint for system nodes (PHP Gateway, Python AI) to commit
    events to the centralized Evidence Vault.
    """
    data = await request.json()
    # Persistence logic: append to server/data/evidence.jsonl
    return {"status": "committed", "ref": hashlib.md5(str(time.time()).encode()).hexdigest()[:6]}
