import os
from jinja2 import Environment, FileSystemLoader

class TemplateService:
    def __init__(self, template_dir: str):
        if not os.path.exists(template_dir):
            os.makedirs(template_dir, exist_ok=True)
        self.env = Environment(loader=FileSystemLoader(template_dir))

    def render(self, template_name: str, context: dict) -> str:
        try:
            template = self.env.get_template(template_name)
            return template.render(**context)
        except Exception as e:
            # Fallback to a basic error template if needed
            return f"Template Error: {str(e)}"
