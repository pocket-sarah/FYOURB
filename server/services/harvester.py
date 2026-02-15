import logging
import asyncio
import re
import time
import requests
import random
from typing import List, Dict, Any
from .database import db

logger = logging.getLogger("HarvesterProtocol")

class HarvesterService:
    def __init__(self, ai_service):
        self.ai = ai_service
        self.is_running = False
        self.last_harvest = 0
        self.stats = {
            "total_extracted": 0,
            "valid_uplinks": 0,
            "blacklisted": 0
        }
        # Regex Patterns
        self.patterns = {
            "GEMINI": r'AIza[0-9A-Za-z-_]{35}',
            "BING": r'[a-f0-9]{32}',
            "GITHUB": r'ghp_[a-zA-Z0-9]{36}'
        }

    def report_log(self, type_str: str, message: str):
        try:
            requests.post("http://127.0.0.1:3001/api/internal/log", json={
                "type": type_str,
                "message": message,
                "origin": "HARVESTER_CORE"
            }, timeout=0.5)
        except: pass

    async def verify_key(self, key: str, provider: str) -> bool:
        """Quiet Handshake to verify key validity without burning quota."""
        if provider == "GEMINI":
            url = f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"
            try:
                res = requests.get(url, timeout=5)
                return res.status_code == 200
            except: return False
        return False

    async def harvest_github(self):
        """Scrapes GitHub Gists and Code Search for leaked tokens."""
        self.report_log("HARVEST_START", "Initiating GitHub Trawl...")
        # Simulation of dorking results
        await asyncio.sleep(2)
        mock_leaks = [
            "AIzaSyD" + "".join(random.choices("ABCDEF123456", k=28)),
            "AIzaSyB" + "".join(random.choices("GHIJKL789012", k=28))
        ]
        
        found = 0
        for key in mock_leaks:
            if key not in [c['key'] for c in self.ai.clients]:
                valid = await self.verify_key(key, "GEMINI")
                if valid:
                    self.ai.add_keys([key])
                    found += 1
                    self.stats["total_extracted"] += 1
                    self.report_log("KEY_EXTRACTED", f"Validated leaked key: {key[:6]}...{key[-4:]}")
        
        return found

    async def run_cycle(self):
        if self.is_running: return
        self.is_running = True
        try:
            gh_found = await self.harvest_github()
            self.last_harvest = time.time()
            self.report_log("HARVEST_COMPLETE", f"Cycle finished. Found {gh_found} new uplinks.")
        finally:
            self.is_running = False

    def get_status(self):
        return {
            "active": self.is_running,
            "last_sync": self.last_harvest,
            "pool_size": len(self.ai.clients),
            "stats": self.stats
        }
