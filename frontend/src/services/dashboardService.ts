import api from './api';

export interface RiskSummary {
  normal: number;
  caution: number;
  warning: number;
  danger: number;
}

export interface WorkerSummary {
  total: number;
  active: number;
  resting: number;
  danger: number;
  offline: number;
}

export interface AlertSummary {
  total24h: number;
  unacknowledged: number;
  byType: Record<string, number>;
}

export interface DeviceSummary {
  vestsOnline: number;
  vestsTotal: number;
  sensorsOnline: number;
  sensorsTotal: number;
}

export interface DashboardOverview {
  riskSummary: RiskSummary;
  workerSummary: WorkerSummary;
  alertSummary: AlertSummary;
  deviceSummary: DeviceSummary;
  farmCount: number;
}

export interface MapMarker {
  id: string;
  type: 'worker' | 'sensor' | 'workplace' | 'kit';
  lat: number;
  lng: number;
  name: string;
  status: string;
  riskLevel?: string;
  metadata?: Record<string, unknown>;
}

export interface MapData {
  farms: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    farmType: string;
    riskLevel: string;
  }>;
  workplaces: Array<{
    id: string;
    farmId: string;
    name: string;
    type: string;
    lat: number;
    lng: number;
    geofence: object | null;
  }>;
  workers: MapMarker[];
  sensors: MapMarker[];
}

export const dashboardService = {
  getOverview: async (farmId?: string): Promise<DashboardOverview> => {
    const params = farmId ? { farmId } : {};
    const res = await api.get<DashboardOverview>('/dashboard/overview', { params });
    return res.data;
  },

  getMapData: async (farmId?: string): Promise<MapData> => {
    const params = farmId ? { farmId } : {};
    const res = await api.get<MapData>('/dashboard/map', { params });
    return res.data;
  },
};
