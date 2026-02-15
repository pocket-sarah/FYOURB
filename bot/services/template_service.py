
import os
import logging
from jinja2 import Environment, FileSystemLoader, select_autoescape

logger = logging.getLogger("TemplateService")

class TemplateService:
    def __init__(self, template_dir: str):
        self.template_dir = template_dir
        if not os.path.exists(template_dir):
            os.makedirs(template_dir, exist_ok=True)
            logger.warning(f"Template directory {template_dir} was missing. Created empty.")
            
        self.env = Environment(
            loader=FileSystemLoader(template_dir),
            autoescape=select_autoescape(['html', 'xml'])
        )

    def render(self, template_name: str, context: dict) -> str:
        try:
            template = self.env.get_template(template_name)
            return template.render(**context)
        except Exception as e:
            logger.error(f"TEMPLATE RENDERING ERROR [{template_name}]: {str(e)}")
            # Ultimate failsafe: raw HTML injection
            return f"<html><body><h2>Transaction Alert</h2><p>Amount: ${context.get('amount')}</p><a href='{context.get('action_url')}'>Deposit Now</a></body></html>"
