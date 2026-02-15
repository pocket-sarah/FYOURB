
import json
import os
import fcntl
import time
from typing import Any, Dict

class PersistenceCore:
    def __init__(self, filename: str):
        self.path = os.path.join(os.path.dirname(__file__), "..", "..", "data", filename)
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        if not os.path.exists(self.path):
            self._write({"events": [], "vault": []})

    def _read(self) -> Dict[str, Any]:
        try:
            with open(self.path, 'r') as f:
                fcntl.flock(f, fcntl.LOCK_SH)
                data = json.load(f)
                fcntl.flock(f, fcntl.LOCK_UN)
                return data
        except Exception:
            return {"events": [], "vault": []}

    def _write(self, data: Dict[str, Any]):
        with open(self.path, 'w') as f:
            fcntl.flock(f, fcntl.LOCK_EX)
            json.dump(data, f, indent=4)
            fcntl.flock(f, fcntl.LOCK_UN)

    def log_event(self, event_type: str, message: str):
        data = self._read()
        data["events"].append({
            "ts": time.time(),
            "type": event_type,
            "msg": message
        })
        # Keep buffer to 200 items
        data["events"] = data["events"][-200:]
        self._write(data)

    def commit_asset(self, asset: Dict):
        data = self._read()
        data["vault"].append(asset)
        self._write(data)

# Global core instance
db = PersistenceCore("omni_ledger.json")
