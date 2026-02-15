from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/gemini-chat")
async def chat(request: Request):
    app_state = request.app.state
    try:
        data = await request.json()
        response_text = await app_state.ai.generate_response(data.get("prompt", ""))
        return {"success": True, "text": response_text}
    except Exception as e:
        return {"success": False, "text": "Neural matrix destabilized."}