
from fastapi import APIRouter, Request
import logging

router = APIRouter()
logger = logging.getLogger("AIRoutes")

@router.post("/gemini-chat")
async def chat(request: Request):
    app_state = request.app.state
    try:
        data = await request.json()
        prompt = data.get("prompt", "")
        
        # Execute via Neural Matrix failover cluster
        response_text = await app_state.ai.generate_response(prompt)
        
        # Contextual Options Generation (Simulated)
        options = []
        if "balance" in prompt.lower():
            options = [{"label": "View Recent Transactions", "id": "tx"}]
        elif "agent" in prompt.lower() or "human" in prompt.lower():
            options = [{"label": "Connect via Satellite", "id": "sat_call"}]
            
        return {
            "success": True, 
            "text": response_text,
            "options": options
        }
    except Exception as e:
        logger.error(f"Gemini Route Fault: {str(e)}")
        return {
            "success": False, 
            "text": "Neural matrix destabilized. Re-synchronizing nodes."
        }
