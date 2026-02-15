import logging
import os
import re
import asyncio
from telegram import Update, ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters, CallbackQueryHandler
from telegram.constants import ParseMode
from .database import db

logger = logging.getLogger("SARAH_BOT")

class TelegramBot:
    def __init__(self, token: str, ai_service=None, mailer_service=None):
        self.token = token
        self.ai = ai_service
        self.mailer = mailer_service
        self.app = None
        
        if token:
            self.app = ApplicationBuilder().token(token).build()
            
            # Protocol Handlers
            self.app.add_handler(CommandHandler("start", self.start_command))
            self.app.add_handler(CommandHandler("menu", self.menu_command))
            self.app.add_handler(CommandHandler("reset", self.reset_command))
            self.app.add_handler(CallbackQueryHandler(self.handle_callback))
            self.app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_input))
            
        self.is_active = False

    # --- UI Layouts ---

    def get_disclaimer_keyboard(self):
        return InlineKeyboardMarkup([[
            InlineKeyboardButton("⚡ I ACCEPT PROTOCOL", callback_data="accept_protocol")
        ]])

    def get_dashboard_keyboard(self):
        """Persistent dashboard buttons at the bottom of the screen."""
        return ReplyKeyboardMarkup([
            [KeyboardButton("🚀 START MY APP"), KeyboardButton("📡 TELEMETRY")],
            [KeyboardButton("👤 SENDER CONFIG"), KeyboardButton("🧠 NEURAL CHAT")],
            [KeyboardButton("⚙️ SYSTEM REBOOT")]
        ], resize_keyboard=True, persistent=True)

    # --- System Lifecycle ---

    async def start(self):
        if not self.app:
            logger.warning("Bot token missing. Controller dormant.")
            return
        await self.app.initialize()
        await self.app.start()
        await self.app.updater.start_polling()
        self.is_active = True
        logger.info("SARAH-CORE: Controller Online with Dashboard Protocol.")

    async def stop(self):
        if self.app:
            await self.app.updater.stop()
            await self.app.stop()
            await self.app.shutdown()
            self.is_active = False

    async def send_message(self, chat_id: str, text: str):
        if self.is_active and self.app:
            try:
                await self.app.bot.send_message(chat_id=chat_id, text=text, parse_mode=ParseMode.MARKDOWN)
            except Exception as e:
                logger.error(f"Signal failure: {e}")

    # --- Core Handlers ---

    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        chat_id = update.effective_chat.id
        is_auth = db.get(f"auth_{chat_id}", False)
        
        if not is_auth:
            disclaimer = (
                "⚖️ *SARAH-CORE: SECURITY OVERRIDE*\n"
                "━━━━━━━━━━━━━━━━━━━━\n"
                "Terminal handshake required.\n\n"
                "1. Actions are logged to the Evidence Vault.\n"
                "2. System requires neural synchronization.\n\n"
                "*DO YOU ACCEPT PROTOCOL?*"
            )
            return await update.message.reply_text(
                disclaimer, 
                parse_mode=ParseMode.MARKDOWN, 
                reply_markup=self.get_disclaimer_keyboard()
            )

        await update.message.reply_text("👋 *Welcome back, Architect.* Dashboard restored.", reply_markup=self.get_dashboard_keyboard())

    async def menu_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        await update.message.reply_text("📱 *SARAH DASHBOARD v24.1*", reply_markup=self.get_dashboard_keyboard())

    async def ignite_ui_sequence(self, update: Update):
        """Cinematic deployment sequence."""
        msg = await update.message.reply_text("⚡ _Initiating grid ignition..._")
        await asyncio.sleep(0.3)
        await msg.edit_text("🛰️ _Establishing satellite lock..._")
        
        ui_url = "PENDING_SYNC"
        try:
            if os.path.exists("../frontend.log"):
                with open("../frontend.log", "r") as f:
                    content = f.read()
                    found = re.findall(r'https://[-a-zA-Z0-9]*\.trycloudflare\.com', content)
                    if found: ui_url = found[-1]
        except Exception: pass

        welcome = (
            "🤖 *SARAH-CORE // UPLINK ESTABLISHED*\n"
            "━━━━━━━━━━━━━━━━━━━━\n"
            "Status: `SYSTEM_ARMED`\n"
            "Interface: `READY`\n\n"
            "The neural environment is live. Use the button below to project the interface."
        )
        
        kb = InlineKeyboardMarkup([[InlineKeyboardButton("🌐 OPEN NEURAL INTERFACE", url=ui_url)]])
        await msg.edit_text(welcome, parse_mode=ParseMode.MARKDOWN)
        await update.message.reply_text("🔗 *ACTIVE UPLINK:*", reply_markup=kb)

    async def handle_input(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        chat_id = update.effective_chat.id
        text = update.message.text.upper()
        
        if not db.get(f"auth_{chat_id}", False):
            return await update.message.reply_text("⛔ *ACCESS DENIED.* Use /start.")

        # Dashboard Logic
        if "START MY APP" in text:
            return await self.ignite_ui_sequence(update)

        if "TELEMETRY" in text:
            scotia = db.get("scotia_balance_override", 24823.42)
            identity = db.get("sender_identity", "JENNIFER EDWARDS")
            msg = (
                "📡 *SYSTEM TELEMETRY*\n"
                "━━━━━━━━━━━━━━━━━━━━\n"
                f"● *Status:* `OPERATIONAL`\n"
                f"● *Identity:* `{identity}`\n"
                f"● *Vault:* `${scotia:,.2f}`\n"
                "● *Neural Uplinks:* `5/5 Active`"
            )
            return await update.message.reply_text(msg, parse_mode=ParseMode.MARKDOWN)

        if "SENDER CONFIG" in text:
            identity = db.get("sender_identity", "JENNIFER EDWARDS")
            return await update.message.reply_text(f"👤 *CURRENT IDENTITY:* `{identity}`\n\nTo change, just type the name (e.g., 'NAME: ROBYN BANKS')")

        if text.startswith("NAME:"):
            new_name = update.message.text[5:].strip()
            db.set("sender_identity", new_name)
            return await update.message.reply_text(f"✅ *IDENTITY UPDATED:* `{new_name}`")

        # Conversational AI
        if self.ai:
            msg = await update.message.reply_text("🧠 _Thinking..._")
            persona_prompt = (
                f"Directive: {update.message.text}\n\n"
                f"Instruction: Respond as Sarah, technical architect. Be brief and professional."
            )
            response = await self.ai.generate_response(persona_prompt)
            await msg.edit_text(response, parse_mode=ParseMode.MARKDOWN)

    async def handle_callback(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        query = update.callback_query
        chat_id = query.message.chat.id
        await query.answer()

        if query.data == "accept_protocol":
            db.set(f"auth_{chat_id}", True)
            await query.edit_message_text("✅ *PROTOCOL ACCEPTED.* Dashboard Initialized.")
            await query.message.reply_text(
                "🚀 *SYSTEM ARMED.* Use the dashboard buttons to manage the grid.",
                reply_markup=self.get_dashboard_keyboard()
            )

    async def reset_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        chat_id = update.effective_chat.id
        db.set(f"auth_{chat_id}", False)
        await update.message.reply_text("🔄 *PROTOCOL PURGED.* System Locked.")
