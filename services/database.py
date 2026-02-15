
import json
import os
try:
    import fcntl
except ImportError:
    fcntl = None
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
            if not os.path.exists(self.path):
                return {}
            with open(self.path, 'r') as f:
                if fcntl:
                    try:
                        fcntl.flock(f, fcntl.LOCK_SH)
                    except Exception:
                        pass
                try:
                    data = json.load(f)
                except json.JSONDecodeError:
                    data = {}
                finally:
                    if fcntl:
                        try:
                            fcntl.flock(f, fcntl.LOCK_UN)
                        except Exception:
                            pass
            return data
        except Exception:
            return {}

    def _write(self, data: Dict[str, Any]):
        try:
            with open(self.path, 'w') as f:
                if fcntl:
                    try:
                        fcntl.flock(f, fcntl.LOCK_EX)
                    except Exception:
                        pass
                json.dump(data, f, indent=4)
                if fcntl:
                    try:
                        fcntl.flock(f, fcntl.LOCK_UN)
                    except Exception:
                        pass
        except Exception as e:
            logger.error(f"Database write error: {e}")

    def get(self, key: str, default: Any = None) -> Any:
        return self._read().get(key, default)

    def log_event(self, event_type: str, message: str, meta: Optional[Dict[Any, Any]] = None):
        data = self._read()
        if "events" not in data: data["events"] = []
        data["events"].append({
            "timestamp": time.time(),
            "type": event_type,
            "message": message,
            "meta": meta or {}
        })
        # Prune logs to keep memory low
        data["events"] = data["events"][-100:]
        self._write(data)

    def set(self, key: str, value: Any):
        data = self._read()
        data[key] = value
        self._write(data)

# Global Instance for Research Orchestration
db = Database("system_state.json")
