from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class AccidentType(str, Enum):
    FALL = "FALL"
    ENTANGLE = "ENTANGLE"
    HEAT = "HEAT"
    FIRE = "FIRE"
    ROLLOVER = "ROLLOVER"
    COLLISION = "COLLISION"


class RiskLevel(str, Enum):
    NORMAL = "normal"
    CAUTION = "caution"
    WARNING = "warning"
    DANGER = "danger"


class PredictionRequest(BaseModel):
    worker_id: int = Field(..., description="작업자 ID")
    sensor_data: dict = Field(..., description="센서 데이터 (모델별 입력)")
    timestamp: Optional[str] = Field(None, description="센서 데이터 수집 시각")


class PredictionResponse(BaseModel):
    accident_type: str = Field(..., description="사고유형 코드")
    risk_score: float = Field(..., ge=0, le=100, description="위험도 점수 (0~100)")
    risk_level: str = Field(..., description="위험등급 (normal/caution/warning/danger)")
    message: Optional[str] = Field(None, description="추가 메시지")
