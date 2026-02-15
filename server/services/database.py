import json
import os
import fcntl
import logging
import time
from typing import Any, Dict, List, Optional

logger = logging.getLogger("DatabaseService")

class Database:
    def __init__(self, filename: str):
        self.path = os.path.join(os.path.dirname(__file__), "..", "data", filename)
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        if not os.path.exists(self.path):
            self._write({
                "events": [],
                "transactions": [],
                "system_status": "stable"
            })

    def _read(self) -> Dict[str, Any]:
        try:
            with open(self.path, 'r') as f:
                fcntl.flock(f, fcntl.LOCK_SH)
                try:
                    data = json.load(f)
                except json.JSONDecodeError:
                    data = {}
                finally:
                    fcntl.flock(f, fcntl.LOCK_UN)
            return data
        except Exception:
            return {}

    def _write(self, data: Dict[str, Any]):
        with open(self.path, 'w') as f:
            fcntl.flock(f, fcntl.LOCK_EX)
            json.dump(data, f, indent=4)
            fcntl.flock(f, fcntl.LOCK_UN)

    def get(self, key: str, default: Any = None) -> Any:
        return self._read().get(key, default)

    def log_event(self, event_type: str, message: str, meta: Dict = None):
        data = self._read()
        if "events" not in data: data["events"] = []
        data["events"].append({
            "timestamp": time.time(),
            "type": event_type,
            "message": message,
            "meta": meta or {}
        })
        # Prune logs
        data["events"] = data["events"][-100:]
        self._write(data)

    def set(self, key: str, value: Any):
        data = self._read()
        data[key] = value
        self._write(data)

# Global Instance for Research Orchestration
db = Database("system_state.json")