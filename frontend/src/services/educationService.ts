import api from './api';

/* ── 타입 정의 ── */

export interface EduContentItem {
  id: string;
  title: string;
  accidentType: string;
  type: string;            // vr_content | kit_training | classroom
  simulatorType: string | null;
  version: string;
  description: string;
  durationMin: number | null;
  difficulty: string | null;
  status: string;          // draft | published | archived
  createdAt: string;
  updatedAt: string;
}

export interface WorkerCourse {
  accidentType: string;
  contentTitle: string;
  completed: boolean;
  score: number | null;
  completedAt: string | null;
}

export interface WorkerProgress {
  workerId: string;
  workerName: string;
  farmName: string;
  courses: WorkerCourse[];
  completionRate: number;
}

export interface Weakness {
  type: string;
  label: string;
  description: string;
  severity: string;
}

export interface RecommendedMission {
  contentTitle: string;
  reason: string;
}

export interface AchievementAnalysis {
  workerId: string;
  workerName: string;
  overallScore: number;
  weaknesses: Weakness[];
  recommendedMissions: RecommendedMission[];
  trainingHistory: { date: string; contentTitle: string; score: number }[];
}

export interface EduScheduleItem {
  id: string;
  title: string;
  farmId: string | null;
  contentIds: string[];
  instructorName: string | null;
  scheduledDate: string;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  maxParticipants: number | null;
  participantIds: string[];
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SimulatorItem {
  id: string;
  name: string;
  simulatorType: string;
  location: string | null;
  status: string;           // active | standby | maintenance | error
  totalSessions: number;
  emergencyStops: number;
  lastMaintenanceAt: string | null;
  firmwareVersion: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KitTrainingRecord {
  id: string;
  workerId: string;
  farmId: string | null;
  trainingType: string;    // stationary | mounted
  trainingDate: string;
  score: number | null;
  passed: boolean;
  durationMin: number | null;
  remarks: string | null;
  evaluatorName: string | null;
  createdAt: string;
}

/* ── API 호출 ── */

export const educationService = {
  // 콘텐츠
  getContents: async (): Promise<EduContentItem[]> => {
    const res = await api.get<EduContentItem[]>('/education/contents');
    return res.data;
  },
  createContent: async (data: Partial<EduContentItem>): Promise<EduContentItem> => {
    const res = await api.post<EduContentItem>('/education/contents', data);
    return res.data;
  },
  updateContent: async (id: string, data: Partial<EduContentItem>): Promise<EduContentItem> => {
    const res = await api.put<EduContentItem>(`/education/contents/${id}`, data);
    return res.data;
  },
  deleteContent: async (id: string): Promise<void> => {
    await api.delete(`/education/contents/${id}`);
  },

  // 이수 현황
  getProgress: async (params?: { farmId?: string; workerId?: string }): Promise<WorkerProgress[]> => {
    const res = await api.get<WorkerProgress[]>('/education/progress', { params });
    return res.data;
  },
  createProgress: async (data: {
    workerId: string;
    contentId: string;
    completed?: boolean;
    score?: number;
    durationMin?: number;
    completedAt?: string;
  }): Promise<unknown> => {
    const res = await api.post('/education/progress', data);
    return res.data;
  },

  // AI 성취도 분석
  getAnalysis: async (workerId: string): Promise<AchievementAnalysis> => {
    const res = await api.get<AchievementAnalysis>(`/education/analysis/${workerId}`);
    return res.data;
  },

  // 일정
  getSchedules: async (): Promise<EduScheduleItem[]> => {
    const res = await api.get<EduScheduleItem[]>('/education/schedules');
    return res.data;
  },
  createSchedule: async (data: Partial<EduScheduleItem>): Promise<EduScheduleItem> => {
    const res = await api.post<EduScheduleItem>('/education/schedules', data);
    return res.data;
  },
  updateSchedule: async (id: string, data: Partial<EduScheduleItem>): Promise<EduScheduleItem> => {
    const res = await api.put<EduScheduleItem>(`/education/schedules/${id}`, data);
    return res.data;
  },
  deleteSchedule: async (id: string): Promise<void> => {
    await api.delete(`/education/schedules/${id}`);
  },

  // 시뮬레이터
  getSimulators: async (): Promise<SimulatorItem[]> => {
    const res = await api.get<SimulatorItem[]>('/education/simulators');
    return res.data;
  },

  // 응급키트 실습
  getKitTrainings: async (): Promise<KitTrainingRecord[]> => {
    const res = await api.get<KitTrainingRecord[]>('/education/kit-training');
    return res.data;
  },
  createKitTraining: async (data: Partial<KitTrainingRecord>): Promise<KitTrainingRecord> => {
    const res = await api.post<KitTrainingRecord>('/education/kit-training', data);
    return res.data;
  },
};
