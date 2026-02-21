"""사고유형별 예측 API 라우터 (스텁)"""

from fastapi import APIRouter
from app.schemas.prediction import PredictionRequest, PredictionResponse

router = APIRouter()


@router.post("/fall", response_model=PredictionResponse)
async def predict_fall(request: PredictionRequest):
    """추락/넘어짐 예측 (FALL) - 스텁"""
    return PredictionResponse(
        accident_type="FALL",
        risk_score=0.0,
        risk_level="normal",
        message="모델 미로드 상태 (스텁 응답)",
    )


@router.post("/heat", response_model=PredictionResponse)
async def predict_heat(request: PredictionRequest):
    """온열질환/질식 예측 (HEAT) - 스텁"""
    return PredictionResponse(
        accident_type="HEAT",
        risk_score=0.0,
        risk_level="normal",
        message="모델 미로드 상태 (스텁 응답)",
    )


@router.post("/entangle", response_model=PredictionResponse)
async def predict_entangle(request: PredictionRequest):
    """끼임/감김 예측 (ENTANGLE) - 스텁"""
    return PredictionResponse(
        accident_type="ENTANGLE",
        risk_score=0.0,
        risk_level="normal",
        message="모델 미로드 상태 (스텁 응답)",
    )


@router.post("/fire", response_model=PredictionResponse)
async def predict_fire(request: PredictionRequest):
    """전기화재 예측 (FIRE) - 스텁"""
    return PredictionResponse(
        accident_type="FIRE",
        risk_score=0.0,
        risk_level="normal",
        message="모델 미로드 상태 (스텁 응답)",
    )


@router.post("/rollover", response_model=PredictionResponse)
async def predict_rollover(request: PredictionRequest):
    """차량 전도/전복 예측 (ROLLOVER) - 스텁"""
    return PredictionResponse(
        accident_type="ROLLOVER",
        risk_score=0.0,
        risk_level="normal",
        message="모델 미로드 상태 (스텁 응답)",
    )


@router.post("/collision", response_model=PredictionResponse)
async def predict_collision(request: PredictionRequest):
    """농기계-작업자 충돌 예측 (COLLISION) - 스텁"""
    return PredictionResponse(
        accident_type="COLLISION",
        risk_score=0.0,
        risk_level="normal",
        message="모델 미로드 상태 (스텁 응답)",
    )
