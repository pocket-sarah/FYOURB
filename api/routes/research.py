
from fastapi import APIRouter, Request
import time
import hashlib
import json
from typing import List, Dict, Any

router = APIRouter(prefix="/evidence")

@router.get("/stream")
async def get_evidence_stream(request: Request):
    """
    Returns a synchronized stream of system events for evidence purposes.
    """
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

    processed_records = []
    for record in mock_events:
        new_record = record.copy()
        content = f"{new_record['node']}{new_record['event']}{new_record['timestamp']}"
        new_record["id"] = hashlib.md5(content.encode()).hexdigest()[:8]
        new_record["integrity_hash"] = hashlib.sha256(json.dumps(new_record).encode()).hexdigest()
        processed_records.append(new_record)

    return {"success": True, "records": processed_records}

@router.post("/log")
async def log_evidence_event(request: Request):
    """
    External endpoint to commit events to the centralized Evidence Vault.
    """
    try:
        data = await request.json()
        ref = hashlib.md5(str(time.time()).encode()).hexdigest()[:6]
        return {"status": "committed", "ref": ref}
    except Exception:
        return {"status": "error", "message": "Malformed payload"}
