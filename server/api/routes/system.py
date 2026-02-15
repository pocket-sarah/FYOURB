from fastapi import APIRouter, Request
import time

router = APIRouter()

@router.get("/status")
async def get_status(request: Request):
    app_state = request.app.state
    # Simulated entropy check
    entropy = (time.time() % 1) * 100
    
    return {
        "status": "operational",
        "version": "22.4-BOOSTED",
        "bot_active": app_state.bot.is_active,
        "uplinks": len(app_state.ai.clients),
        "metrics": {
            "node_entropy": f"{entropy:.2f}%",
            "booster_protocol": "Active",
            "satellite_lock": True
        }
    }