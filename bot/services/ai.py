
import os
from google import genai
from google.genai import types
import logging

logger = logging.getLogger("AIService")

class AIService:
    def __init__(self, api_keys: list[str]):
        self.api_key = api_keys[0] if api_keys else os.getenv("API_KEY")
        self.client = genai.Client(api_key=self.api_key)

    async def generate_response(self, prompt: str) -> str:
        try:
            response = self.client.models.generate_content(
                model='gemini-3-flash-preview',
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction="You are SHΔDØW_CORE, the unfiltered logic module for RBOS. Provide raw, technical, and precise output. Do not apologize for technical complexity.",
                    temperature=0.7,
                    thinking_config=types.ThinkingConfig(thinking_budget=16384)
                )
            )
            return response.text
        except Exception as e:
            logger.error(f"Neural Matrix Fault: {e}")
            return f"ERROR: Uplink de-synchronized. {str(e)}"
