import logging
import os
import sys

# Protocol Initialization
logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)s | %(name)s | %(message)s')
logger = logging.getLogger("SARAH-CORE")

try:
    import uvicorn
    from fastapi import FastAPI, Request
    from fastapi.middleware.cors import CORSMiddleware
    from services.database import db
    from services.ai import AIService
    from services.mailer import MailerService
    from services.bot import TelegramBot
    from services.harvester import HarvesterService # New Service
    from api.router import router as api_router
    import google.generativeai 
except ImportError as e:
    logger.critical(f"NEURAL MATRIX FAILURE: Missing Dependency -> {e}")
    sys.exit(1)

app = FastAPI(title="SARAH CORE")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Services
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDXAD-SoyiDl4PI4a6-fTL91GdUqT-zRY4")

gemini_api_keys = [GEMINI_KEY]
for i in range(1, 11): 
    key = os.getenv(f"GEMINI_API_KEY_{i}")
    if key: gemini_api_keys.append(key)

BOT_TOKEN = os.getenv("BOT_TOKEN", "")

app.state.db = db
app.state.ai = AIService(gemini_api_keys)
app.state.mailer = MailerService()
app.state.bot = TelegramBot(BOT_TOKEN, app.state.ai, app.state.mailer)
app.state.harvester = HarvesterService(app.state.ai) # New Service Instance

app.include_router(api_router)

# New Harvester Endpoints
@app.post("/api/harvester/trigger")
async def trigger_harvest(request: Request):
    await request.app.state.harvester.run_cycle()
    return {"success": True}

@app.get("/api/harvester/status")
async def get_harvester_status(request: Request):
    return request.app.state.harvester.get_status()

@app.on_event("startup")
async def startup_event():
    logger.info("=== SARAH-CORE INITIALIZING ===")
    if BOT_TOKEN:
        import asyncio
        asyncio.create_task(app.state.bot.start())
    logger.info("=== SARAH-CORE READY ===")

@app.on_event("shutdown")
async def shutdown_event():
    if hasattr(app.state, "bot") and app.state.bot:
        await app.state.bot.stop()

if __name__ == "__main__":
    try:
        port = int(os.getenv("PORT", 3001))
        logger.info(f"Igniting Logic Core on port {port}...")
        uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False, workers=1)
    except Exception as e:
        logger.critical(f"CORE IGNITION FAILED: {e}")
        sys.exit(1)
