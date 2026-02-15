
import os
import re
import logging

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

    def scan_filesystem(self):
        """Walks the file tree and detects hardcoded credentials."""
        results = []
        found_keys = []
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
                        
                        for key in matches:
                            severity = "CRITICAL"
                            if ".env" in file:
                                severity = "SECURE (ENV)"
                            elif "config.php" in file or "config.py" in file:
                                severity = "WARNING (CONFIG)"
                            
                            masked_key = f"{key[:6]}...{key[-4:]}"
                            
                            # Collect unique raw keys
                            if key not in found_keys:
                                found_keys.append(key)
                            
                            results.append({
                                "file": path.replace(self.root_dir, ""),
                                "severity": severity,
                                "match": masked_key,
                                "raw_key": key, 
                                "type": "GEMINI_API_KEY"
                            })
                except Exception as e:
                    logger.debug(f"Skipping file {file}: {e}")

        # LOGGING PROTOCOL: DUMP FOUND KEYS
        if found_keys:
            logger.warning("========================================")
            logger.warning(f" [!] SECURITY ALERT: {len(found_keys)} UNIQUE KEYS EXPOSED")
            logger.warning("========================================")
            for k in found_keys:
                logger.warning(f" KEY: {k}")
            logger.warning("========================================")
        else:
            logger.info("Scan complete. No keys found.")

        return {
            "files_scanned": scanned_count,
            "leaks_found": results,
            "unique_keys": found_keys
        }
