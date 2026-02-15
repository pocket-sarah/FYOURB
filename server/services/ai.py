from google import genai
from google.genai import types
import logging
import os
import random
import asyncio

logger = logging.getLogger("AIService")

class AIService:
    def __init__(self, api_keys: list[str]):
        self.api_keys = list(set([k for k in api_keys if k]))
        self.clients = []
        self._init_clients()

    def _init_clients(self):
        for i, key in enumerate(self.api_keys):
            try:
                client = genai.Client(api_key=key)
                self.clients.append({
                    "id": i, 
                    "client": client, 
                    "errors": 0, 
                    "available": True,
                    "last_used": 0
                })
            except Exception as e:
                logger.error(f"Uplink {i} failed initialization: {e}")
        
        if not self.clients:
            logger.critical("CRITICAL: All Neural Uplinks Offline.")

    async def generate_response(self, prompt: str) -> str:
        if not self.clients:
            return "SYSTEM ERROR: NEURAL LINK SEVERED."
        
        # Sort by least errors and availability
        available_clients = [c for c in self.clients if c["available"]]
        if not available_clients:
            # Emergency reset: Attempt to use all clients again
            for c in self.clients: c["available"] = True
            available_clients = self.clients
            
        random.shuffle(available_clients)
        
        for uplink in available_clients:
            client = uplink["client"]
            uid = uplink["id"]
            
            try:
                # Direct call following official SDK patterns
                response = client.models.generate_content(
                    model="gemini-3-flash-preview", 
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.7,
                        max_output_tokens=800,
                        top_p=0.9
                    )
                )
                
                if response and response.text:
                    uplink["last_used"] = time.time()
                    return response.text
                else:
                    raise ValueError("Packet Empty")

            except Exception as e:
                uplink["errors"] += 1
                if uplink["errors"] > 5:
                    uplink["available"] = False
                    logger.error(f"Uplink {uid} de-synced due to high entropy: {e}")
                continue
        
        return "CRITICAL FAILURE: Neural Matrix exhausted. Re-initialize credentials."
