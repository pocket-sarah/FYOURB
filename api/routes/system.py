from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import time
import logging
from typing import List, Dict, Any, Optional

router = APIRouter()
logger = logging.getLogger("SystemRoute")

class ConfigUpdate(BaseModel):
    config: Dict[str, Any]

@router.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": time.time()}

@router.post("/config")
async def update_config(data: ConfigUpdate, request: Request):
    """Persists the frontend system configuration to the backend database."""
    try:
        app_state = request.app.state
        app_state.db.set("system_config", data.config)
        app_state.db.log_event("CONFIG_SYNC", "System configuration synchronized from UI.")
        return {"success": True}
    except Exception as e:
        logger.error(f"Config sync failure: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": str(e)})

@router.get("/status")
async def get_status(request: Request):
    try:
        app_state = request.app.state
        db = app_state.db
        
        entropy = (time.time() % 1) * 100
        
        uplinks = []
        if hasattr(app_state, "ai") and app_state.ai and hasattr(app_state.ai, "clients"):
            for uplink in app_state.ai.clients:
                uplinks.append({
                    "id": uplink["id"],
                    "masked_key": f"{uplink['key'][:6]}...{uplink['key'][-4:]}" if uplink.get('key') else "INVALID",
                    "available": uplink.get("available", False),
                    "errors": uplink.get("errors", 0),
                    "last_used": uplink.get("last_used", 0)
                })
        
        bot_active = False
        if hasattr(app_state, "bot") and app_state.bot:
            bot_active = getattr(app_state.bot, "is_active", False)

        return {
            "status": "operational",
            "version": "22.4-BOOSTED",
            "bot_active": bot_active,
            "uplink_count": len(uplinks),
            "uplinks": uplinks,
            "metrics": {
                "node_entropy": f"{entropy:.2f}%",
                "booster_protocol": "Active",
                "satellite_lock": True,
                "scotia_override": db.get("scotia_balance_override"),
                "td_override": db.get("td_balance_override"),
                "sender_override": db.get("sender_identity")
            }
        }
    except Exception as e:
        logger.error(f"Critical error in /status endpoint: {e}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e), "trace": "System node initialization pending."}
        )
