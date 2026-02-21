import api from './api';

// ── 타입 정의 ──

export interface AccidentRecord {
  id: string;
  type: string;
  severity: string;
  isNearMiss: boolean;
  farmId: string;
  workplaceId: string | null;
  workerId: string | null;
  occurredAt: string;
  description: string | null;
  cause: string | null;
  actionsTaken: string | null;
  attachments: string[] | null;
  createdAt: string;
  farm?: { id: string; name: string } | null;
  workplace?: { id: string; name: string } | null;
  worker?: { id: string; userId: string } | null;
}

export interface AccidentQuery {
  type?: string;
  severity?: string;
  from?: string;
  to?: string;
  farmId?: string;
  isNearMiss?: boolean;
}

export interface MonthlyTrend {
  month: string;
  accidents: number;
  nearMisses: number;
}

export interface TypeDistribution {
  type: string;
  label: string;
  count: number;
  percentage: number;
}

export interface FarmAlertFrequency {
  farmId: string;
  farmName: string;
  count: number;
}

export interface HourlyHeatmap {
  day: number;
  dayLabel: string;
  hour: number;
  count: number;
}

export interface FalseAlarmTrend {
  month: string;
  totalAlerts: number;
  falseAlarms: number;
  rate: number;
}

export interface StatisticsData {
  monthlyTrend: MonthlyTrend[];
  typeDistribution: TypeDistribution[];
  farmAlertFrequency: FarmAlertFrequency[];
  hourlyHeatmap: HourlyHeatmap[];
  falseAlarmTrend: FalseAlarmTrend[];
}

// ── API 서비스 ──

export const reportService = {
  // 사고 CRUD
  getAccidents: async (query: AccidentQuery = {}): Promise<AccidentRecord[]> => {
    const res = await api.get<AccidentRecord[]>('/accidents', { params: query });
    return res.data;
  },
  getAccident: async (id: string): Promise<AccidentRecord> => {
    const res = await api.get<AccidentRecord>(`/accidents/${id}`);
    return res.data;
  },
  createAccident: async (data: Partial<AccidentRecord>): Promise<AccidentRecord> => {
    const res = await api.post<AccidentRecord>('/accidents', data);
    return res.data;
  },
  updateAccident: async (id: string, data: Partial<AccidentRecord>): Promise<AccidentRecord> => {
    const res = await api.put<AccidentRecord>(`/accidents/${id}`, data);
    return res.data;
  },
  deleteAccident: async (id: string): Promise<void> => {
    await api.delete(`/accidents/${id}`);
  },

  // 통계
  getStatistics: async (params?: { from?: string; to?: string; farmId?: string }): Promise<StatisticsData> => {
    const res = await api.get<StatisticsData>('/reports/statistics', { params });
    return res.data;
  },
};
