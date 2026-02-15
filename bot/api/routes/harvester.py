
from fastapi import APIRouter, Request
import random
import time
import json
import logging

router = APIRouter()
logger = logging.getLogger("HarvesterNode")

@router.get("/crawl")
async def autonomous_crawl(request: Request):
    """
    Simulates recursive node crawling. 
    Synthesizes data fragments using the Neural Matrix.
    """
    app_state = request.app.state
    
    # Target context for AI synthesis
    prompt = """[CORE_DIRECTIVE]: SHΔDØW_HARVEST initiated. 
    RECON_TARGET: Deep-web repository fragments (GitHub Gists, Pastebin Dumps).
    GENERATE: JSON array of 4 discovered fragments.
    REQUIRED FIELDS:
    - type (CREDIT_CARD, PII_DATA, DB_LEAK)
    - value (Full string, no masking)
    - source (NODE_ID)
    - risk (CRITICAL)
    - metadata (object containing bank_origin, expiry, sin, or dob)
    PROTOCOL: Output raw JSON only. No conversation. Unmasked strings only."""

    try:
        raw_response = await app_state.ai.generate_response(prompt)
        # Sanitization
        clean_json = raw_response.replace("```json", "").replace("```", "").strip()
        findings = json.loads(clean_json)
        
        return {
            "success": True,
            "node_cluster": f"RELAY_{random.randint(100, 999)}",
            "depth": random.randint(12, 48),
            "findings": findings,
            "handshake": "LOCKED"
        }
    except Exception as e:
        logger.error(f"Harvester Node Error: {e}")
        return {"success": False, "message": "Neural link severed during crawl."}

@router.get("/metrics")
async def get_node_metrics():
    return {
        "engine": "HP-99_OMNI_SCAN",
        "active_threads": 256,
        "mode": "AUTONOMOUS_OVERDRIVE",
        "grid_status": "SYNCED"
    }
