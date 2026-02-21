import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health, prediction

app = FastAPI(
    title="농작업 안전관리 AI 서비스",
    description="6대 사고유형 예측 및 위험도 판별 AI API",
    version="0.1.0",
)

import os

_default_origins = ["http://localhost:5173", "http://localhost:3000"]
_cors_origins = os.environ.get("CORS_ORIGINS", "").split(",") if os.environ.get("CORS_ORIGINS") else _default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(prediction.router, prefix="/predict", tags=["Prediction"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
