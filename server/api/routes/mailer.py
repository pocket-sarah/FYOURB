
import asyncio
import logging
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from concurrent.futures import ThreadPoolExecutor
from services.database import db

router = APIRouter()
executor = ThreadPoolExecutor(max_workers=5)
logger = logging.getLogger("MailerRoute")

class DebugMailRequest(BaseModel):
    to: str
    subject: str
    body: str

@router.post("/mailer")
async def send_mail(request: Request):
    app_state = request.app.state
    try:
        data = await request.json()
        tx_id = app_state.mailer.generate_tx_id()
        link = app_state.mailer.generate_link(tx_id, data.get('amount', 0), data.get('recipient_email'))
        
        # High-Fidelity Handshake Delay for realism
        await asyncio.sleep(1.5) 
        
        loop = asyncio.get_event_loop()
        # Delivery results now include the path metadata
        delivery_result = await loop.run_in_executor(executor, app_state.mailer.send_email, data, tx_id, link)
        
        # Audit Trail Log
        db.log_event("DISPATCH_SIGNAL", f"Transaction {tx_id} released to grid via {delivery_result.get('path')}", {
            "recipient": data.get('recipient_email'),
            "amount": data.get('amount'),
            "tx_id": tx_id
        })

        return {
            "success": True, 
            "transaction_id": tx_id, 
            "debug_link": link,
            "path": delivery_result.get("path", "UNKNOWN"),
            "latency": "1.5s",
            "protocol": "SMTP_TLS_1.3"
        }
    except Exception as e:
        logger.error(f"Mailer BLACKOUT: {str(e)}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Neural Handshake Blackout: " + str(e)})

@router.post("/mailer/debug")
async def send_debug_mail(payload: DebugMailRequest, request: Request):
    app_state = request.app.state
    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            executor, 
            app_state.mailer.send_debug_email, 
            payload.to, 
            payload.subject, 
            payload.body
        )
        return {"success": True, "message": "Signal dispatched successfully via Python Relay."}
    except Exception as e:
        logger.error(f"Debug Mailer Failure: {str(e)}")
        return JSONResponse(status_code=500, content={"success": False, "message": f"Python Relay Failure: {str(e)}"})
