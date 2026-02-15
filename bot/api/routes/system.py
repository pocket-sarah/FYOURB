from fastapi import APIRouter, Request
import time

router = APIRouter()

@router.get("/status")
async def get_status(request: Request):
    app_state = request.app.state
    # Simulated entropy check for visual fidelity
    entropy = (time.time() % 1) * 100
    
    # Get actual neural matrix status from AI service
    uplink_status = app_state.ai.get_status()
    
    return {
        "status": "operational",
        "version": "22.4-BOOSTED",
        "bot_active": app_state.bot.is_active if app_state.bot else False,
        "uplinks_count": len(uplink_status),
        "uplinks": uplink_status,
        "metrics": {
            "node_entropy": f"{entropy:.2f}%",
            "booster_protocol": "Active",
            "satellite_lock": True
        }
    }
