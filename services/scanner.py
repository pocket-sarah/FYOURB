
import os
import re
import logging
import time
import json
from typing import List, Dict, Any

logger = logging.getLogger("LeakScanner")

class LeakScanner:
    def __init__(self, root_dir="."):
        self.root_dir = root_dir
        # Regex for Google API Keys (AIza...)
        self.key_pattern = re.compile(r'(AIza[0-9A-Za-z-_]{35})')
        self.ignore_dirs = {
            'node_modules', 'venv', '__pycache__', '.git', 'dist', 'build', '.idea', '.vscode'
        }
        self.ignore_files = {
            'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', '.DS_Store'
        }

    def _process_matches(self, matches: List[str], source_file: str = "") -> List[Dict[str, Any]]:
        results = []
        for key in matches:
            severity = "CRITICAL"
            if ".env" in source_file:
                severity = "SECURE (ENV)"
            elif "config.php" in source_file or "config.py" in source_file:
                severity = "WARNING (CONFIG)"
            
            masked_key = f"{key[:6]}...{key[-4:]}"
            
            results.append({
                "file": source_file,
                "severity": severity,
                "match": masked_key,
                "raw_key": key, 
                "type": "GEMINI_API_KEY",
                "timestamp": time.time()
            })
        return results

    def scan_filesystem(self):
        """Walks the file tree and detects hardcoded credentials."""
        all_leak_results = []
        found_unique_keys = set()
        scanned_count = 0
        
        logger.info(f"Initiating Deep Scan on: {os.path.abspath(self.root_dir)}")

        for root, dirs, files in os.walk(self.root_dir):
            # Prune ignored directories
            dirs[:] = [d for d in dirs if d not in self.ignore_dirs]
            
            for file in files:
                if file in self.ignore_files:
                    continue
                    
                path = os.path.join(root, file)
                scanned_count += 1
                
                try:
                    # Skip binary files/images
                    if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.ico', '.pyc', '.exe')):
                        continue

                    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        matches = self.key_pattern.findall(content)
                        
                        if matches:
                            file_leak_results = self._process_matches(matches, path.replace(self.root_dir, ""))
                            all_leak_results.extend(file_leak_results)
                            for key in matches:
                                found_unique_keys.add(key)
                            
                except Exception as e:
                    logger.debug(f"Skipping file {file}: {e}")

        return {
            "files_scanned": scanned_count,
            "leaks_found": all_leak_results,
            "unique_keys": list(found_unique_keys)
        }

    def scan_text_for_keys(self, text_content: str, source_identifier: str = "scraped_data") -> Dict[str, Any]:
        """Scans a given string content for sensitive keys."""
        all_leak_results = []
        found_unique_keys = set()
        
        matches = self.key_pattern.findall(text_content)
        if matches:
            text_leak_results = self._process_matches(matches, source_identifier)
            all_leak_results.extend(text_leak_results)
            for key in matches:
                found_unique_keys.add(key)

        return {
            "leaks_found": all_leak_results,
            "unique_keys": list(found_unique_keys)
        }
