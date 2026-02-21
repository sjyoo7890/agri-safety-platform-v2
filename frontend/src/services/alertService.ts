import api from './api';

// ── 타입 정의 ──

export interface AlertHistory {
  id: string;
  type: string;
  severity: string;
  farmId: string;
  workplaceId: string | null;
  workerId: string | null;
  message: string;
  channels: string[] | null;
  status: string;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
  createdAt: string;
  farm?: { id: string; name: string } | null;
  worker?: { id: string; userId: string } | null;
}

export interface AlertRule {
  id: string;
  farmId: string;
  severity: string;
  channels: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AlertRecipient {
  id: string;
  farmId: string;
  name: string;
  severity: string;
  alertType: string | null;
  userIds: string[];
  includeExternal: boolean;
  createdAt: string;
}

export interface ECallRecord {
  id: string;
  alertId: string | null;
  farmId: string;
  workerId: string | null;
  triggerType: string;
  lat: number | null;
  lng: number | null;
  workerInfo: Record<string, unknown> | null;
  accidentType: string | null;
  status: string;
  resolvedAt: string | null;
  createdAt: string;
  farm?: { id: string; name: string } | null;
  worker?: { id: string; userId: string } | null;
}

export interface AlertTemplate {
  id: string;
  alertType: string;
  severity: string;
  title: string;
  messageTemplate: string;
  ttsTemplate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EscalationRule {
  id: string;
  farmId: string;
  severity: string;
  step: number;
  waitMinutes: number;
  targetType: string;
  targetUserIds: string[] | null;
  isActive: boolean;
  createdAt: string;
}

export interface AlertHistoryQuery {
  from?: string;
  to?: string;
  type?: string;
  severity?: string;
  status?: string;
  farmId?: string;
}

// ── API 서비스 ──

export const alertService = {
  // 알림
  createAlert: async (data: Record<string, unknown>): Promise<AlertHistory> => {
    const res = await api.post<AlertHistory>('/alerts', data);
    return res.data;
  },
  getAlertHistory: async (query: AlertHistoryQuery = {}): Promise<AlertHistory[]> => {
    const res = await api.get<AlertHistory[]>('/alerts/history', { params: query });
    return res.data;
  },
  acknowledgeAlert: async (id: string, userId: string): Promise<AlertHistory> => {
    const res = await api.put<AlertHistory>(`/alerts/${id}/acknowledge`, { userId });
    return res.data;
  },

  // 알림 규칙
  getAlertRules: async (farmId?: string): Promise<AlertRule[]> => {
    const params = farmId ? { farmId } : {};
    const res = await api.get<AlertRule[]>('/alerts/rules', { params });
    return res.data;
  },
  upsertAlertRules: async (farmId: string, rules: Partial<AlertRule>[]): Promise<AlertRule[]> => {
    const res = await api.put<AlertRule[]>('/alerts/rules', { farmId, rules });
    return res.data;
  },

  // 수신자 그룹
  getRecipients: async (farmId?: string): Promise<AlertRecipient[]> => {
    const params = farmId ? { farmId } : {};
    const res = await api.get<AlertRecipient[]>('/alerts/recipients', { params });
    return res.data;
  },
  createRecipient: async (data: Partial<AlertRecipient>): Promise<AlertRecipient> => {
    const res = await api.post<AlertRecipient>('/alerts/recipients', data);
    return res.data;
  },
  updateRecipient: async (id: string, data: Partial<AlertRecipient>): Promise<AlertRecipient> => {
    const res = await api.put<AlertRecipient>(`/alerts/recipients/${id}`, data);
    return res.data;
  },
  deleteRecipient: async (id: string): Promise<void> => {
    await api.delete(`/alerts/recipients/${id}`);
  },

  // E-Call
  createECall: async (data: Record<string, unknown>): Promise<ECallRecord> => {
    const res = await api.post<ECallRecord>('/ecall', data);
    return res.data;
  },
  getECallHistory: async (farmId?: string): Promise<ECallRecord[]> => {
    const params = farmId ? { farmId } : {};
    const res = await api.get<ECallRecord[]>('/ecall/history', { params });
    return res.data;
  },
  resolveECall: async (id: string): Promise<ECallRecord> => {
    const res = await api.put<ECallRecord>(`/ecall/${id}/resolve`);
    return res.data;
  },

  // 템플릿
  getTemplates: async (): Promise<AlertTemplate[]> => {
    const res = await api.get<AlertTemplate[]>('/alerts/templates');
    return res.data;
  },
  createTemplate: async (data: Partial<AlertTemplate>): Promise<AlertTemplate> => {
    const res = await api.post<AlertTemplate>('/alerts/templates', data);
    return res.data;
  },
  updateTemplate: async (id: string, data: Partial<AlertTemplate>): Promise<AlertTemplate> => {
    const res = await api.put<AlertTemplate>(`/alerts/templates/${id}`, data);
    return res.data;
  },
  deleteTemplate: async (id: string): Promise<void> => {
    await api.delete(`/alerts/templates/${id}`);
  },

  // 에스컬레이션
  getEscalationRules: async (farmId?: string): Promise<EscalationRule[]> => {
    const params = farmId ? { farmId } : {};
    const res = await api.get<EscalationRule[]>('/alerts/escalation', { params });
    return res.data;
  },
  upsertEscalationRules: async (farmId: string, rules: Partial<EscalationRule>[]): Promise<EscalationRule[]> => {
    const res = await api.put<EscalationRule[]>('/alerts/escalation', { farmId, rules });
    return res.data;
  },
};
