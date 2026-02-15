
import logging
import os
import re # Import re for API key validation
import asyncio
import time
import google.generativeai as genai # Correct import for the Python SDK
import random # Imported for random.shuffle

logger = logging.getLogger("AIService")

class AIService:
    def __init__(self, api_keys: list[str]):
        self.api_keys = [] # Will store only keys and their metadata, not client objects
        self.clients = [] # This will effectively be metadata for keys
        for i, key in enumerate(api_keys):
            self._create_client(i, key) # Renamed to better reflect it just adds key metadata
        
        if not self.clients:
            logger.critical("CRITICAL: All Neural Uplinks Offline. No valid API keys found or initialized.")
        self.gemini_key_rotation_status = "idle" 

    def _create_client(self, client_id, key):
        # Basic API key format validation
        if not re.match(r'^AIza[0-9A-Za-z-_]{35}$', key):
            logger.warning(f"Uplink {client_id}: Invalid API key format detected. Key will not be used.")
            return

        # Store metadata for the key
        self.clients.append({
            "id": client_id, 
            "key": key,
            "errors": 0, 
            "available": True,
            "last_used": 0
        })
        logger.info(f"Uplink {client_id} (masked: {key[:6]}...{key[-4:]}) initialized successfully.")

    def add_keys(self, new_keys: list[str]):
        """Dynamically adds new keys to the pool if they don't already exist."""
        added_count = 0
        for key in new_keys:
            # Check if key already exists in self.clients based on 'key' value
            if not any(c['key'] == key for c in self.clients):
                new_id = len(self.clients)
                self._create_client(new_id, key)
                added_count += 1
        
        if added_count > 0:
            logger.info(f"Neural Matrix Expanded: {added_count} new uplinks established.")
        return added_count

    async def generate_response(self, prompt: str) -> str:
        if not self.clients:
            return "SYSTEM ERROR: NEURAL LINK SEVERED."
        
        # Sort by least errors and availability
        available_clients = [c for c in self.clients if c["available"]]
        if not available_clients:
            # Emergency reset: Attempt to use all clients again
            for c in self.clients: c["available"] = True
            available_clients = self.clients
            logger.warning("All uplinks exhausted, performing emergency reset of availability status.")
            
        random.shuffle(available_clients) # Shuffle to distribute load if errors are equal
        
        for uplink in available_clients:
            selected_key = uplink["key"]
            uid = uplink["id"]
            
            try:
                # Dynamically configure API key before each request
                genai.configure(api_key=selected_key)
                
                # Use the GenerativeModel directly as per @google/genai guidelines
                model = genai.GenerativeModel(
                    model_name="gemini-3-flash-preview", 
                )
                
                response = model.generate_content(
                    contents=prompt,
                    generation_config=genai.types.GenerationConfig( # Correctly using genai.types.GenerationConfig
                        temperature=0.7,
                        max_output_tokens=800,
                        top_p=0.9
                    )
                )
                
                if response and response.text:
                    uplink["last_used"] = time.time()
                    uplink["errors"] = 0 # Reset errors on success
                    return response.text
                else:
                    raise ValueError("Packet Empty or Invalid Response")

            except Exception as e:
                uplink["errors"] += 1
                logger.warning(f"Uplink {uid} (masked: {selected_key[:6]}...{selected_key[-4:]}) error: {e}")
                if uplink["errors"] > 5: # Threshold for considering a key unavailable
                    uplink["available"] = False
                    logger.error(f"Uplink {uid} de-synced due to high entropy: {e}")
                continue # Try next available client
        
        return "CRITICAL FAILURE: Neural Matrix exhausted. Re-initialize credentials or check network."
