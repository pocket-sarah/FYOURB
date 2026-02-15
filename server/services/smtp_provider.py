import smtplib
import ssl
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger("SMTPProvider")

class SMTPProvider:
    def __init__(self, host, port, user, password):
        self.host = host
        self.port = port
        self.user = user
        self.password = password

    def dispatch(self, recipient: str, sender_display: str, subject: str, html_body: str, reply_to: str = None):
        msg = MIMEMultipart("alternative")
        msg['Subject'] = subject
        msg['From'] = f"{sender_display} <{self.user}>"
        msg['To'] = recipient
        
        if reply_to:
            msg['Reply-To'] = reply_to
            
        msg.attach(MIMEText(html_body, "html", "utf-8"))

        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

        try:
            with smtplib.SMTP(self.host, self.port) as server:
                server.set_debuglevel(0)
                server.starttls(context=context)
                server.login(self.user, self.password)
                server.sendmail(self.user, recipient, msg.as_string())
                return True
        except Exception as e:
            logger.error(f"SMTP PROVIDER ERROR: {e}")
            raise e
