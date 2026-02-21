import api from './api';

/** 스마트 조끼 */
export interface SmartVest {
  id: string;
  serialNo: string;
  moduleType: 'open_field' | 'livestock' | 'orchard';
  workerId: string | null;
  farmId: string;
  batteryLevel: number;
  commStatus: 'online' | 'offline' | 'error';
  commType: 'ble' | 'lora' | 'lte' | null;
  lastHeartbeat: string | null;
  firmwareVer: string | null;
  createdAt: string;
  updatedAt: string;
  worker?: { id: string; userId: string } | null;
  farm?: { id: string; name: string } | null;
}

/** 응급키트 */
export interface EmergencyKit {
  id: string;
  serialNo: string;
  type: 'wall_mounted' | 'vehicle_mounted';
  farmId: string;
  workplaceId: string | null;
  vehicleId: string | null;
  lat: number | null;
  lng: number | null;
  status: 'normal' | 'opened' | 'alarm' | 'maintenance';
  batteryLevel: number | null;
  lastHeartbeat: string | null;
  createdAt: string;
  farm?: { id: string; name: string } | null;
  workplace?: { id: string; name: string } | null;
}

/** 환경센서 */
export interface Sensor {
  id: string;
  serialNo: string;
  type: 'temperature' | 'humidity' | 'gas_o2' | 'gas_h2s' | 'gas_nh3' | 'gas_ch4' | 'current' | 'voltage' | 'wbgt';
  workplaceId: string;
  lat: number | null;
  lng: number | null;
  status: 'online' | 'offline' | 'error' | 'calibrating';
  thresholdConfig: { caution: number; warning: number; danger: number } | null;
  lastHeartbeat: string | null;
  createdAt: string;
  workplace?: { id: string; name: string } | null;
}

/** 센서 데이터 */
export interface SensorDataPoint {
  time: string;
  sensorId: string;
  value: number;
  unit: string | null;
}

/** 알림 이벤트 */
export interface AlertEvent {
  id: string;
  type: string;
  severity: string;
  message: string;
  status: string;
  createdAt: string;
}

export const deviceService = {
  // ── 스마트 조끼 ──
  getVests: async (farmId?: string): Promise<SmartVest[]> => {
    const params = farmId ? { farmId } : {};
    const res = await api.get<SmartVest[]>('/devices/vests', { params });
    return res.data;
  },
  getVest: async (id: string): Promise<SmartVest> => {
    const res = await api.get<SmartVest>(`/devices/vests/${id}`);
    return res.data;
  },
  createVest: async (data: Partial<SmartVest>): Promise<SmartVest> => {
    const res = await api.post<SmartVest>('/devices/vests', data);
    return res.data;
  },
  updateVest: async (id: string, data: Partial<SmartVest>): Promise<SmartVest> => {
    const res = await api.put<SmartVest>(`/devices/vests/${id}`, data);
    return res.data;
  },
  deleteVest: async (id: string): Promise<void> => {
    await api.delete(`/devices/vests/${id}`);
  },
  assignVest: async (id: string, workerId: string | null): Promise<SmartVest> => {
    const res = await api.post<SmartVest>(`/devices/vests/${id}/assign`, { workerId });
    return res.data;
  },

  // ── 응급키트 ──
  getKits: async (farmId?: string): Promise<EmergencyKit[]> => {
    const params = farmId ? { farmId } : {};
    const res = await api.get<EmergencyKit[]>('/devices/kits', { params });
    return res.data;
  },
  getKit: async (id: string): Promise<EmergencyKit> => {
    const res = await api.get<EmergencyKit>(`/devices/kits/${id}`);
    return res.data;
  },
  createKit: async (data: Partial<EmergencyKit>): Promise<EmergencyKit> => {
    const res = await api.post<EmergencyKit>('/devices/kits', data);
    return res.data;
  },
  updateKit: async (id: string, data: Partial<EmergencyKit>): Promise<EmergencyKit> => {
    const res = await api.put<EmergencyKit>(`/devices/kits/${id}`, data);
    return res.data;
  },
  deleteKit: async (id: string): Promise<void> => {
    await api.delete(`/devices/kits/${id}`);
  },
  getKitEvents: async (id: string): Promise<AlertEvent[]> => {
    const res = await api.get<AlertEvent[]>(`/devices/kits/${id}/events`);
    return res.data;
  },

  // ── 환경센서 ──
  getSensors: async (workplaceId?: string): Promise<Sensor[]> => {
    const params = workplaceId ? { workplaceId } : {};
    const res = await api.get<Sensor[]>('/devices/sensors', { params });
    return res.data;
  },
  getSensor: async (id: string): Promise<Sensor> => {
    const res = await api.get<Sensor>(`/devices/sensors/${id}`);
    return res.data;
  },
  createSensor: async (data: Partial<Sensor>): Promise<Sensor> => {
    const res = await api.post<Sensor>('/devices/sensors', data);
    return res.data;
  },
  updateSensor: async (id: string, data: Partial<Sensor>): Promise<Sensor> => {
    const res = await api.put<Sensor>(`/devices/sensors/${id}`, data);
    return res.data;
  },
  deleteSensor: async (id: string): Promise<void> => {
    await api.delete(`/devices/sensors/${id}`);
  },
  getSensorData: async (id: string, from: string, to: string): Promise<SensorDataPoint[]> => {
    const res = await api.get<SensorDataPoint[]>(`/devices/sensors/${id}/data`, {
      params: { from, to },
    });
    return res.data;
  },
  updateThreshold: async (id: string, config: { caution: number; warning: number; danger: number }): Promise<Sensor> => {
    const res = await api.put<Sensor>(`/devices/sensors/${id}/threshold`, config);
    return res.data;
  },
};
