"""ONNX 모델 로더 스텁 - 실제 모델 파일이 준비되면 구현"""

import os
from typing import Optional


class ModelLoader:
    """ONNX Runtime을 사용한 모델 로딩 및 추론 관리"""

    def __init__(self, model_dir: str = "./models"):
        self.model_dir = model_dir
        self.models: dict = {}

    def load_model(self, model_name: str) -> bool:
        """모델 파일 로드 (스텁)"""
        model_path = os.path.join(self.model_dir, f"{model_name}.onnx")
        if not os.path.exists(model_path):
            return False
        # TODO: onnxruntime.InferenceSession으로 실제 로드
        self.models[model_name] = None
        return True

    def predict(self, model_name: str, input_data: dict) -> Optional[dict]:
        """모델 추론 실행 (스텁)"""
        if model_name not in self.models:
            return None
        # TODO: 실제 추론 로직 구현
        return {
            "risk_score": 0.0,
            "risk_level": "normal",
            "accident_type": model_name,
        }


model_loader = ModelLoader()
