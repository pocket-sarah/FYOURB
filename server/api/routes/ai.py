from fastapi import APIRouter, Request
import requests

router = APIRouter()

def report_log(type_str, message, meta=None):
    try:
        requests.post("http://127.0.0.1:3001/api/internal/log", json={
            "type": type_str,
            "message": message,
            "meta": meta or {},
            "origin": "PY_NEURAL"
        }, timeout=1)
    except:
        pass

@router.post("/gemini-chat")
async def chat(request: Request):
    app_state = request.app.state
    try:
        data = await request.json()
        prompt = data.get("prompt", "")
        if not prompt:
            return {"success": False, "text": "Prompt not provided."}
            
        report_log("AI_THINKING", "Processing neural directive...")
        response_text = await app_state.ai.generate_response(prompt)
        report_log("AI_COMPLETE", "Neural synthesis finished.")
        
        return {"success": True, "text": response_text}
    except Exception as e:
        report_log("AI_CRITICAL", str(e))
        return {"success": False, "text": "Neural matrix destabilized."}