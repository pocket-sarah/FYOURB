import asyncio
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from concurrent.futures import ThreadPoolExecutor

router = APIRouter()
executor = ThreadPoolExecutor(max_workers=5)

@router.post("/mailer")
async def send_mail(request: Request):
    app_state = request.app.state
    try:
        data = await request.json()
        tx_id = app_state.mailer.generate_tx_id()
        link = app_state.mailer.generate_link(tx_id, data.get('amount', 0))
        
        await asyncio.sleep(1.2) # Optimized network handshake
        
        loop = asyncio.get_event_loop()
        # Delivery results now include the path metadata
        delivery_result = await loop.run_in_executor(executor, app_state.mailer.send_email, data, tx_id, link)
        
        return {
            "success": True, 
            "transaction_id": tx_id, 
            "debug_link": link,
            "path": delivery_result.get("path", "UNKNOWN")
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "message": str(e)})
