"""AI Service serverless handler for Vercel Python Runtime.

Provides health check and stub prediction endpoints without
external dependencies (stdlib only).
"""

import json
import os
from http.server import BaseHTTPRequestHandler

# CORS origins
_cors_raw = os.environ.get("CORS_ORIGINS", "")
CORS_ORIGIN = _cors_raw.split(",")[0] if _cors_raw else "*"

STUB_RESPONSE = {
    "risk_score": 0.0,
    "risk_level": "normal",
    "message": "모델 미로드 상태 (스텁 응답)",
}

ACCIDENT_TYPES = ["fall", "heat", "entangle", "fire", "rollover", "collision"]


def _cors_headers():
    return {
        "Access-Control-Allow-Origin": CORS_ORIGIN,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
    }


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status, body):
        self.send_response(status)
        for k, v in _cors_headers().items():
            self.send_header(k, v)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(body, ensure_ascii=False).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(204)
        for k, v in _cors_headers().items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        path = self.path.rstrip("/")
        if path == "/ai-api/health":
            self._send_json(200, {"status": "ok", "service": "agri-safety-ai"})
        else:
            self._send_json(404, {"detail": "Not Found"})

    def do_POST(self):
        path = self.path.rstrip("/")
        for atype in ACCIDENT_TYPES:
            if path == f"/ai-api/predict/{atype}":
                self._send_json(200, {"accident_type": atype.upper(), **STUB_RESPONSE})
                return
        self._send_json(404, {"detail": "Not Found"})
