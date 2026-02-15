
import os
import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.bot import TelegramBot
from services.mailer import MailerService
from services.ai import AIService
from api.router import router as api_router
from dotenv import load_dotenv

# Initialize Environmental Shield
load_dotenv(dotenv_path="../.env.local")

# Logging Protocol: OMNI-CORE Standard
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("OMNI-CORE")

class SystemState:
    """Centralized container for system-level uplinks."""
    def __init__(self):
        self.bot = None
        self.mailer = None
        self.ai = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup Sequence
    state = SystemState()
    
    # 1. Telegram Uplink
    bot_token = os.getenv("BOT_TOKEN", "8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM")
    state.bot = TelegramBot(token=bot_token)
    
    # 2. SMTP Relay
    state.mailer = MailerService()
    
    # 3. Neural Matrix (AI)
    # Support for multiple key failover
    api_keys = [os.getenv("GEMINI_API_KEY")] + [os.getenv(f"GEMINI_API_KEY_{i}") for i in range(2, 21)]
    state.ai = AIService(api_keys=api_keys)

    # Attach to FastAPI application state
    app.state.bot = state.bot
    app.state.mailer = state.mailer
    app.state.ai = state.ai

    logger.info(" --- OMNI-CORE V22.4 RBOS NEURAL RESEARCH ENGINE LOADED --- ") # Updated branding
    
    if bot_token:
        asyncio.create_task(state.bot.start())
    
    yield
    
    # Teardown Sequence
    if state.bot:
        await state.bot.stop()
    logger.info(" --- OMNI-CORE RBOS SHUTDOWN COMPLETE --- ") # Updated branding

# Fast API Matrix Entry
app = FastAPI(
    title="RBOS-CORE Neural API", # Updated branding
    version="22.4.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect Router Grid
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    # Execution entry for development environments
    uvicorn.run("main:app", host="127.0.0.1", port=3001, reload=True)