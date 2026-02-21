import api from './api';

/* ── 사용자 ── */

export interface UserItem {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string | null;
  farmId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ── 농가 ── */

export interface FarmItem {
  id: string;
  name: string;
  ownerId: string | null;
  address: string;
  lat: number;
  lng: number;
  farmType: string;
  area: number | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkplaceItem {
  id: string;
  farmId: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  geofence: object | null;
  createdAt: string;
}

/* ── 장비 자산 ── */

export interface AssetSummary {
  smartVests: { total: number; online: number; offline: number; error: number; assigned: number; unassigned: number };
  emergencyKits: { total: number; normal: number; opened: number; alarm: number; maintenance: number };
  sensors: { total: number; online: number; offline: number; error: number; calibrating: number };
}

export interface AssetItem {
  id: string;
  category: string;
  name: string;
  status: string;
  farmName: string | null;
  workerName: string | null;
  lastSeen: string | null;
}

/* ── 시스템 설정 ── */

export interface SettingItem {
  key: string;
  value: string;
  description: string | null;
  group: string;
  valueType: string;
  updatedAt: string;
}

/* ── API 키 ── */

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  description: string | null;
  status: string;
  allowedIps: string[];
  rateLimit: number;
  totalRequests: number;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface ApiKeyUsage {
  keyId: string;
  totalRequests: number;
  lastUsedAt: string | null;
  dailyUsage: { date: string; count: number }[];
}

/* ── 감사 로그 ── */

export interface AuditLogItem {
  id: string;
  userId: string | null;
  userEmail: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  ip: string | null;
  statusCode: number | null;
  durationMs: number | null;
  createdAt: string;
}

export interface AuditLogQuery {
  userId?: string;
  action?: string;
  resource?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogPage {
  data: AuditLogItem[];
  total: number;
  page: number;
  limit: number;
}

/* ── API 호출 ── */

export const systemService = {
  // 사용자
  getUsers: async (params?: { farmId?: string }): Promise<UserItem[]> => {
    const res = await api.get<UserItem[]>('/users', { params });
    return res.data;
  },
  createUser: async (data: Partial<UserItem> & { password?: string }): Promise<UserItem> => {
    const res = await api.post<UserItem>('/users', data);
    return res.data;
  },
  updateUser: async (id: string, data: Partial<UserItem>): Promise<UserItem> => {
    const res = await api.put<UserItem>(`/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // 농가
  getFarms: async (): Promise<FarmItem[]> => {
    const res = await api.get<FarmItem[]>('/farms');
    return res.data;
  },
  createFarm: async (data: Partial<FarmItem>): Promise<FarmItem> => {
    const res = await api.post<FarmItem>('/farms', data);
    return res.data;
  },
  updateFarm: async (id: string, data: Partial<FarmItem>): Promise<FarmItem> => {
    const res = await api.put<FarmItem>(`/farms/${id}`, data);
    return res.data;
  },
  deleteFarm: async (id: string): Promise<void> => {
    await api.delete(`/farms/${id}`);
  },

  // 농작업장
  getWorkplaces: async (farmId: string): Promise<WorkplaceItem[]> => {
    const res = await api.get<WorkplaceItem[]>(`/farms/${farmId}/workplaces`);
    return res.data;
  },
  createWorkplace: async (farmId: string, data: Partial<WorkplaceItem>): Promise<WorkplaceItem> => {
    const res = await api.post<WorkplaceItem>(`/farms/${farmId}/workplaces`, data);
    return res.data;
  },
  updateWorkplace: async (farmId: string, id: string, data: Partial<WorkplaceItem>): Promise<WorkplaceItem> => {
    const res = await api.put<WorkplaceItem>(`/farms/${farmId}/workplaces/${id}`, data);
    return res.data;
  },
  deleteWorkplace: async (farmId: string, id: string): Promise<void> => {
    await api.delete(`/farms/${farmId}/workplaces/${id}`);
  },

  // 장비 자산
  getAssetSummary: async (): Promise<AssetSummary> => {
    const res = await api.get<AssetSummary>('/assets/summary');
    return res.data;
  },
  getAssetList: async (params?: { farmId?: string }): Promise<AssetItem[]> => {
    const res = await api.get<{
      smartVests: Array<{ id: string; serialNo?: string; commStatus?: string; farm?: { name: string } | null; worker?: { name: string } | null; lastSeen?: string; createdAt?: string }>;
      emergencyKits: Array<{ id: string; serialNo?: string; status?: string; farm?: { name: string } | null; workplace?: { name: string } | null; lastSeen?: string; createdAt?: string }>;
      sensors: Array<{ id: string; name?: string; sensorType?: string; status?: string; workplace?: { name: string; farm?: { name: string } } | null; lastSeen?: string; createdAt?: string }>;
    }>('/assets', { params });
    const { smartVests = [], emergencyKits = [], sensors = [] } = res.data;
    const items: AssetItem[] = [
      ...smartVests.map((v) => ({
        id: v.id,
        category: 'smart_vest',
        name: v.serialNo || v.id.slice(0, 8),
        status: v.commStatus || 'offline',
        farmName: v.farm?.name ?? null,
        workerName: v.worker?.name ?? null,
        lastSeen: v.lastSeen ?? null,
      })),
      ...emergencyKits.map((k) => ({
        id: k.id,
        category: 'emergency_kit',
        name: k.serialNo || k.id.slice(0, 8),
        status: k.status || 'normal',
        farmName: k.farm?.name ?? null,
        workerName: k.workplace?.name ?? null,
        lastSeen: k.lastSeen ?? null,
      })),
      ...sensors.map((s) => ({
        id: s.id,
        category: 'sensor',
        name: s.name || s.sensorType || s.id.slice(0, 8),
        status: s.status || 'offline',
        farmName: s.workplace?.farm?.name ?? null,
        workerName: s.workplace?.name ?? null,
        lastSeen: s.lastSeen ?? null,
      })),
    ];
    return items;
  },

  // 시스템 설정
  getSettings: async (): Promise<SettingItem[]> => {
    const res = await api.get<SettingItem[]>('/settings');
    return res.data;
  },
  updateSettings: async (settings: { key: string; value: string }[]): Promise<SettingItem[]> => {
    const res = await api.put<SettingItem[]>('/settings', { settings });
    return res.data;
  },

  // API 키
  getApiKeys: async (): Promise<ApiKeyItem[]> => {
    const res = await api.get<ApiKeyItem[]>('/api-keys');
    return res.data;
  },
  createApiKey: async (data: { name: string; description?: string; allowedIps?: string[]; rateLimit?: number; expiresAt?: string }): Promise<ApiKeyItem & { plainKey: string }> => {
    const res = await api.post<ApiKeyItem & { plainKey: string }>('/api-keys', data);
    return res.data;
  },
  revokeApiKey: async (id: string): Promise<void> => {
    await api.put(`/api-keys/${id}/revoke`);
  },
  deleteApiKey: async (id: string): Promise<void> => {
    await api.delete(`/api-keys/${id}`);
  },
  getApiKeyUsage: async (id: string): Promise<ApiKeyUsage> => {
    const res = await api.get<ApiKeyUsage>(`/api-keys/${id}/usage`);
    return res.data;
  },

  // 감사 로그
  getAuditLogs: async (query: AuditLogQuery = {}): Promise<AuditLogPage> => {
    const res = await api.get<AuditLogPage>('/audit-logs', { params: query });
    return res.data;
  },
};
