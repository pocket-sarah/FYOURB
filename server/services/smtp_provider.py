import smtplib
import ssl
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger("SMTPProvider")

class SMTPProvider:
    def __init__(self, host, port, user, password):
        self.host = host
        self.port = int(port)
        self.user = user
        self.password = password

    def dispatch(self, recipient: str, sender_display: str, subject: str, html_body: str):
        if not self.host or not self.user:
            raise ValueError("SMTP configuration incomplete. Update via System Settings.")

        msg = MIMEMultipart("alternative")
        msg['Subject'] = subject
        msg['From'] = f"{sender_display} <{self.user}>"
        msg['To'] = recipient
        msg.attach(MIMEText(html_body, "html", "utf-8"))

        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

        try:
            # Handle SSL/TLS (Implicit)
            if self.port == 465:
                with smtplib.SMTP_SSL(self.host, self.port, context=context, timeout=15) as server:
                    server.login(self.user, self.password)
                    server.sendmail(self.user, recipient, msg.as_string())
                    server.quit()
            else:
                # Handle STARTTLS (Explicit)
                with smtplib.SMTP(self.host, self.port, timeout=15) as server:
                    server.set_debuglevel(0)
                    server.starttls(context=context)
                    server.login(self.user, self.password)
                    server.sendmail(self.user, recipient, msg.as_string())
                    server.quit()
            return True
        except smtplib.SMTPAuthenticationError:
            raise Exception(f"Authentication failed for {self.user}. Verify password.")
        except Exception as e:
            logger.error(f"SMTP DISPATCH ERROR on {self.host}:{self.port} -> {e}")
            raise e
