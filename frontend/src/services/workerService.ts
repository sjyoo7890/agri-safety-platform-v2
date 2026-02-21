import api from './api';

// ── 타입 정의 ──

export interface WorkerStatus {
  worker: {
    id: string;
    userId: string;
    name: string;
    age: number | null;
    gender: string | null;
    acclimatizationLevel: string | null;
    farmId: string;
    farmName: string;
  };
  vest: {
    id: string;
    serialNo: string;
    batteryLevel: number;
    commStatus: string;
    lastHeartbeat: string | null;
  } | null;
  vitals: {
    heartRate: number | null;
    bodyTemp: number | null;
  };
  riskLevel: string;
}

export interface VitalDataPoint {
  time: string;
  heartRate: number | null;
  bodyTemp: number | null;
}

export interface PostureStatus {
  posture: 'normal' | 'risky' | 'fallen';
  roll: number;
  pitch: number;
  lastUpdated: string;
}

export interface TimelineEvent {
  time: string;
  endTime: string | null;
  type: 'work' | 'rest' | 'danger_event';
  label: string;
  metadata?: Record<string, unknown>;
}

export interface AcclimatizationAnalysis {
  level: string;
  levelLabel: string;
  heatExposureHours14d: number;
  recommendedWorkMinutes: number;
  recommendedRestMinutes: number;
  dailyExposure: Array<{ date: string; hours: number }>;
}

// ── API 서비스 ──

export const workerService = {
  getStatus: async (id: string): Promise<WorkerStatus> => {
    const res = await api.get<WorkerStatus>(`/workers/${id}/status`);
    return res.data;
  },

  getVitals: async (id: string, from?: string, to?: string): Promise<VitalDataPoint[]> => {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;
    const res = await api.get<VitalDataPoint[]>(`/workers/${id}/vitals`, { params });
    return res.data;
  },

  getPosture: async (id: string): Promise<PostureStatus> => {
    const res = await api.get<PostureStatus>(`/workers/${id}/posture`);
    return res.data;
  },

  getTimeline: async (id: string): Promise<TimelineEvent[]> => {
    const res = await api.get<TimelineEvent[]>(`/workers/${id}/timeline`);
    return res.data;
  },

  getAcclimatization: async (id: string): Promise<AcclimatizationAnalysis> => {
    const res = await api.get<AcclimatizationAnalysis>(`/workers/${id}/acclimatization`);
    return res.data;
  },
};
