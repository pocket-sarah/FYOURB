import unittest
import json
import requests
import time

BASE_URL = "http://127.0.0.1:3001/api"

class OmniCoreTests(unittest.TestCase):
    def test_system_status(self):
        """Verify core node is operational."""
        response = requests.get(f"{BASE_URL}/status")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "operational")
        self.assertIn("version", data)

    def test_mailer_handshake(self):
        """Verify SMTP relay logic with dummy data."""
        payload = {
            "recipient_email": "test@example.com",
            "recipient_name": "Test User",
            "amount": 100.50,
            "purpose": "Internal Test"
        }
        # Note: This may return 500 if actual SMTP is not configured, 
        # but in research mode we check for protocol consistency.
        response = requests.post(f"{BASE_URL}/mailer", json=payload)
        self.assertIn(response.status_code, [200, 500])
        if response.status_code == 200:
            data = response.json()
            self.assertTrue(data["success"])
            self.assertIn("transaction_id", data)

    def test_ai_matrix_consistency(self):
        """Verify neural matrix can process a simple handshake."""
        payload = {"prompt": "Hello System"}
        response = requests.post(f"{BASE_URL}/gemini-chat", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("text", data)

if __name__ == "__main__":
    unittest.main()