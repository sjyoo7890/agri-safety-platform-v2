import api from './api';

// ── 타입 정의 ──

export interface RealtimePrediction {
  modelType: string;
  label: string;
  prediction: number;
  confidence: number;
  latestId: string | null;
}

export interface XaiResult {
  predictionId: string;
  modelType: string;
  prediction: number;
  xaiFactors: Array<{ feature: string; contribution: number }>;
  llmMessage: string | null;
}

export interface ModelPerformance {
  modelType: string;
  label: string;
  accuracy: number;
  auroc: number;
  falseAlarmRate: number;
  status: 'normal' | 'caution' | 'danger';
  totalPredictions: number;
}

export interface RiskAssessmentResult {
  id: string;
  farmId: string | null;
  workplaceId: string | null;
  riskScore: number;
  riskLevel: string;
  hazards: Array<{ code: string; name: string; score: number; source: string }> | null;
  countermeasures: Array<{ code: string; action: string; priority: number }> | null;
  assessedAt: string;
  expiresAt: string | null;
  farm?: { id: string; name: string } | null;
  workplace?: { id: string; name: string } | null;
}

export interface HazardRecommendation {
  code: string;
  name: string;
  score: number;
  source: string;
}

export interface Countermeasure {
  code: string;
  action: string;
  priority: number;
}

// ── API 서비스 ──

export const aiService = {
  // AI 예측
  getRealtimePredictions: async (farmId?: string): Promise<RealtimePrediction[]> => {
    const params = farmId ? { farmId } : {};
    const res = await api.get<RealtimePrediction[]>('/predictions/realtime', { params });
    return res.data;
  },

  getXaiResult: async (predictionId: string): Promise<XaiResult> => {
    const res = await api.get<XaiResult>(`/predictions/${predictionId}/xai`);
    return res.data;
  },

  getModelPerformance: async (): Promise<ModelPerformance[]> => {
    const res = await api.get<ModelPerformance[]>('/predictions/models/performance');
    return res.data;
  },

  markFalseAlarm: async (predictionId: string): Promise<void> => {
    await api.post(`/predictions/${predictionId}/false-alarm`);
  },

  // 동적 위험성평가
  getCurrentRiskAssessment: async (farmId?: string): Promise<RiskAssessmentResult> => {
    const params = farmId ? { farmId } : {};
    const res = await api.get<RiskAssessmentResult>('/risk-assessment/current', { params });
    return res.data;
  },

  getRiskHistory: async (params?: { farmId?: string; from?: string; to?: string }): Promise<RiskAssessmentResult[]> => {
    const res = await api.get<RiskAssessmentResult[]>('/risk-assessment/history', { params });
    return res.data;
  },

  getHazards: async (farmId?: string): Promise<HazardRecommendation[]> => {
    const params = farmId ? { farmId } : {};
    const res = await api.get<HazardRecommendation[]>('/risk-assessment/hazards', { params });
    return res.data;
  },

  getCountermeasures: async (farmId?: string): Promise<Countermeasure[]> => {
    const params = farmId ? { farmId } : {};
    const res = await api.get<Countermeasure[]>('/risk-assessment/countermeasures', { params });
    return res.data;
  },
};
