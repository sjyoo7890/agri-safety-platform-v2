/**
 * 데모용 모의 데이터
 * 백엔드 서버 없이 프론트엔드 UI를 확인할 수 있도록 함
 */

// ── 공통 ID ──
const FARM_1 = 'f0000001-0000-4000-a000-000000000001';
const FARM_2 = 'f0000002-0000-4000-a000-000000000002';
const WP_1 = 'w0000001-0000-4000-a000-000000000001';
const WP_2 = 'w0000002-0000-4000-a000-000000000002';
const WP_3 = 'w0000003-0000-4000-a000-000000000003';
const WORKER_1 = 'wk000001-0000-4000-a000-000000000001';
const WORKER_2 = 'wk000002-0000-4000-a000-000000000002';
const WORKER_3 = 'wk000003-0000-4000-a000-000000000003';
const WORKER_4 = 'wk000004-0000-4000-a000-000000000004';
const WORKER_5 = 'wk000005-0000-4000-a000-000000000005';

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3600000).toISOString();
}
function daysAgo(d: number) {
  return new Date(Date.now() - d * 86400000).toISOString();
}
function minutesAgo(m: number) {
  return new Date(Date.now() - m * 60000).toISOString();
}

// ── 대시보드 ──
export const mockDashboardOverview = {
  riskSummary: { normal: 12, caution: 5, warning: 2, danger: 1 },
  workerSummary: { total: 20, active: 14, resting: 3, danger: 1, offline: 2 },
  alertSummary: {
    total24h: 8,
    unacknowledged: 3,
    byType: { HEAT: 3, FALL: 2, COLLISION: 1, ENTANGLE: 1, FIRE: 1 },
  },
  deviceSummary: { vestsOnline: 16, vestsTotal: 20, sensorsOnline: 28, sensorsTotal: 32 },
  farmCount: 4,
};

export const mockMapData = {
  farms: [
    { id: FARM_1, name: '행복농장', lat: 35.1796, lng: 129.0756, farmType: '노지', riskLevel: 'caution' },
    { id: FARM_2, name: '풍년과수원', lat: 35.185, lng: 129.082, farmType: '과수원', riskLevel: 'normal' },
    { id: 'f0000003', name: '초록축산', lat: 35.172, lng: 129.069, farmType: '축산', riskLevel: 'warning' },
    { id: 'f0000004', name: '신선시설농장', lat: 35.190, lng: 129.075, farmType: '시설', riskLevel: 'normal' },
  ],
  workplaces: [
    { id: WP_1, farmId: FARM_1, name: 'A동 비닐하우스', type: 'greenhouse', lat: 35.1800, lng: 129.0760, geofence: null },
    { id: WP_2, farmId: FARM_1, name: 'B동 노지밭', type: 'open_field', lat: 35.1790, lng: 129.0745, geofence: null },
    { id: WP_3, farmId: FARM_2, name: '사과 과수원', type: 'orchard', lat: 35.1855, lng: 129.0825, geofence: null },
  ],
  workers: [
    { id: WORKER_1, type: 'worker' as const, lat: 35.1801, lng: 129.0762, name: '김철수', status: 'active', riskLevel: 'normal', metadata: { heartRate: 78, bodyTemp: 36.5 } },
    { id: WORKER_2, type: 'worker' as const, lat: 35.1792, lng: 129.0748, name: '이영희', status: 'active', riskLevel: 'caution', metadata: { heartRate: 92, bodyTemp: 37.1 } },
    { id: WORKER_3, type: 'worker' as const, lat: 35.1856, lng: 129.0828, name: '박민수', status: 'resting', riskLevel: 'normal', metadata: { heartRate: 68, bodyTemp: 36.3 } },
    { id: WORKER_4, type: 'worker' as const, lat: 35.1795, lng: 129.0755, name: '정소영', status: 'active', riskLevel: 'warning', metadata: { heartRate: 105, bodyTemp: 37.8 } },
    { id: WORKER_5, type: 'worker' as const, lat: 35.1725, lng: 129.0695, name: '최동현', status: 'active', riskLevel: 'danger', metadata: { heartRate: 118, bodyTemp: 38.2 } },
  ],
  sensors: [
    { id: 's001', type: 'sensor' as const, lat: 35.1802, lng: 129.0758, name: '온도센서-A1', status: 'online', metadata: { value: 33.5, unit: '℃' } },
    { id: 's002', type: 'sensor' as const, lat: 35.1793, lng: 129.0750, name: '습도센서-B1', status: 'online', metadata: { value: 72.3, unit: '%' } },
    { id: 's003', type: 'sensor' as const, lat: 35.1857, lng: 129.0822, name: 'WBGT-C1', status: 'online', metadata: { value: 28.7, unit: '℃' } },
    { id: 's004', type: 'sensor' as const, lat: 35.1726, lng: 129.0698, name: '가스센서-D1', status: 'offline', metadata: { value: 0, unit: 'ppm' } },
  ],
};

// ── 작업자 상세 ──
export const mockWorkerStatus = {
  worker: {
    id: WORKER_1,
    userId: 'u001',
    name: '김철수',
    age: 45,
    gender: '남',
    acclimatizationLevel: 'acclimatized',
    farmId: FARM_1,
    farmName: '행복농장',
  },
  vest: {
    id: 'v001',
    serialNo: 'SV-2024-0001',
    batteryLevel: 87,
    commStatus: 'online',
    lastHeartbeat: minutesAgo(1),
  },
  vitals: { heartRate: 78, bodyTemp: 36.5 },
  riskLevel: 'normal',
};

export function mockVitalsData(): Array<{ time: string; heartRate: number | null; bodyTemp: number | null }> {
  const data = [];
  for (let i = 60; i >= 0; i--) {
    data.push({
      time: minutesAgo(i),
      heartRate: 70 + Math.round(Math.random() * 20),
      bodyTemp: 36.2 + Math.round(Math.random() * 10) / 10,
    });
  }
  return data;
}

export const mockPosture = {
  posture: 'normal' as const,
  roll: 2.3,
  pitch: -1.8,
  lastUpdated: minutesAgo(0),
};

export const mockTimeline = [
  { time: hoursAgo(8), endTime: hoursAgo(6), type: 'work' as const, label: '비닐하우스 수확 작업' },
  { time: hoursAgo(6), endTime: hoursAgo(5.5), type: 'rest' as const, label: '휴식' },
  { time: hoursAgo(5.5), endTime: hoursAgo(3), type: 'work' as const, label: '운반 작업' },
  { time: hoursAgo(3), endTime: hoursAgo(2.8), type: 'danger_event' as const, label: '온열 경고 (체온 37.9℃)', metadata: { bodyTemp: 37.9 } },
  { time: hoursAgo(2.8), endTime: hoursAgo(2.3), type: 'rest' as const, label: '강제 휴식' },
  { time: hoursAgo(2.3), endTime: null, type: 'work' as const, label: '정리 작업' },
];

export const mockAcclimatization = {
  level: 'acclimatized',
  levelLabel: '순응 완료',
  heatExposureHours14d: 42.5,
  recommendedWorkMinutes: 50,
  recommendedRestMinutes: 10,
  dailyExposure: Array.from({ length: 14 }, (_, i) => ({
    date: daysAgo(13 - i).split('T')[0],
    hours: 2 + Math.round(Math.random() * 4 * 10) / 10,
  })),
};

// ── 디바이스 ──
export const mockVests = [
  { id: 'v001', serialNo: 'SV-2024-0001', moduleType: 'open_field' as const, workerId: WORKER_1, farmId: FARM_1, batteryLevel: 87, commStatus: 'online' as const, commType: 'lte' as const, lastHeartbeat: minutesAgo(1), firmwareVer: 'v2.1.3', createdAt: daysAgo(120), updatedAt: daysAgo(1), worker: { id: WORKER_1, userId: 'u001' }, farm: { id: FARM_1, name: '행복농장' } },
  { id: 'v002', serialNo: 'SV-2024-0002', moduleType: 'livestock' as const, workerId: WORKER_2, farmId: FARM_1, batteryLevel: 52, commStatus: 'online' as const, commType: 'ble' as const, lastHeartbeat: minutesAgo(2), firmwareVer: 'v2.1.3', createdAt: daysAgo(115), updatedAt: daysAgo(2), worker: { id: WORKER_2, userId: 'u002' }, farm: { id: FARM_1, name: '행복농장' } },
  { id: 'v003', serialNo: 'SV-2024-0003', moduleType: 'orchard' as const, workerId: WORKER_3, farmId: FARM_2, batteryLevel: 95, commStatus: 'online' as const, commType: 'lora' as const, lastHeartbeat: minutesAgo(0.5), firmwareVer: 'v2.1.2', createdAt: daysAgo(90), updatedAt: daysAgo(3), worker: { id: WORKER_3, userId: 'u003' }, farm: { id: FARM_2, name: '풍년과수원' } },
  { id: 'v004', serialNo: 'SV-2024-0004', moduleType: 'open_field' as const, workerId: null, farmId: FARM_1, batteryLevel: 15, commStatus: 'offline' as const, commType: null, lastHeartbeat: daysAgo(2), firmwareVer: 'v2.0.8', createdAt: daysAgo(200), updatedAt: daysAgo(2), worker: null, farm: { id: FARM_1, name: '행복농장' } },
  { id: 'v005', serialNo: 'SV-2024-0005', moduleType: 'livestock' as const, workerId: WORKER_5, farmId: FARM_1, batteryLevel: 33, commStatus: 'error' as const, commType: 'lte' as const, lastHeartbeat: hoursAgo(1), firmwareVer: 'v2.1.3', createdAt: daysAgo(60), updatedAt: hoursAgo(1), worker: { id: WORKER_5, userId: 'u005' }, farm: { id: FARM_1, name: '행복농장' } },
];

export const mockKits = [
  { id: 'k001', serialNo: 'EK-2024-001', type: 'wall_mounted' as const, farmId: FARM_1, workplaceId: WP_1, vehicleId: null, lat: 35.1801, lng: 129.0761, status: 'normal' as const, batteryLevel: 95, lastHeartbeat: minutesAgo(5), createdAt: daysAgo(100), farm: { id: FARM_1, name: '행복농장' }, workplace: { id: WP_1, name: 'A동 비닐하우스' } },
  { id: 'k002', serialNo: 'EK-2024-002', type: 'vehicle_mounted' as const, farmId: FARM_1, workplaceId: null, vehicleId: 'TRK-01', lat: 35.1793, lng: 129.0747, status: 'normal' as const, batteryLevel: 78, lastHeartbeat: minutesAgo(10), createdAt: daysAgo(80), farm: { id: FARM_1, name: '행복농장' }, workplace: null },
  { id: 'k003', serialNo: 'EK-2024-003', type: 'wall_mounted' as const, farmId: FARM_2, workplaceId: WP_3, vehicleId: null, lat: 35.1856, lng: 129.0824, status: 'opened' as const, batteryLevel: 60, lastHeartbeat: minutesAgo(2), createdAt: daysAgo(90), farm: { id: FARM_2, name: '풍년과수원' }, workplace: { id: WP_3, name: '사과 과수원' } },
];

export const mockSensors = [
  { id: 's001', serialNo: 'SN-T-001', type: 'temperature' as const, workplaceId: WP_1, lat: 35.1802, lng: 129.0758, status: 'online' as const, thresholdConfig: { caution: 30, warning: 35, danger: 40 }, lastHeartbeat: minutesAgo(1), createdAt: daysAgo(100), workplace: { id: WP_1, name: 'A동 비닐하우스' } },
  { id: 's002', serialNo: 'SN-H-001', type: 'humidity' as const, workplaceId: WP_1, lat: 35.1803, lng: 129.0759, status: 'online' as const, thresholdConfig: { caution: 70, warning: 80, danger: 90 }, lastHeartbeat: minutesAgo(1), createdAt: daysAgo(100), workplace: { id: WP_1, name: 'A동 비닐하우스' } },
  { id: 's003', serialNo: 'SN-W-001', type: 'wbgt' as const, workplaceId: WP_2, lat: 35.1791, lng: 129.0746, status: 'online' as const, thresholdConfig: { caution: 25, warning: 28, danger: 31 }, lastHeartbeat: minutesAgo(2), createdAt: daysAgo(90), workplace: { id: WP_2, name: 'B동 노지밭' } },
  { id: 's004', serialNo: 'SN-G-001', type: 'gas_o2' as const, workplaceId: WP_1, lat: 35.1800, lng: 129.0757, status: 'offline' as const, thresholdConfig: { caution: 19.5, warning: 18, danger: 16 }, lastHeartbeat: hoursAgo(3), createdAt: daysAgo(80), workplace: { id: WP_1, name: 'A동 비닐하우스' } },
  { id: 's005', serialNo: 'SN-C-001', type: 'current' as const, workplaceId: WP_3, lat: 35.1855, lng: 129.0823, status: 'online' as const, thresholdConfig: { caution: 15, warning: 20, danger: 25 }, lastHeartbeat: minutesAgo(1), createdAt: daysAgo(60), workplace: { id: WP_3, name: '사과 과수원' } },
];

export function mockSensorData(): Array<{ time: string; sensorId: string; value: number; unit: string }> {
  const data = [];
  for (let i = 120; i >= 0; i--) {
    data.push({ time: minutesAgo(i), sensorId: 's001', value: 28 + Math.random() * 8, unit: '℃' });
  }
  return data;
}

// ── 알림 ──
export const mockAlertHistory = [
  { id: 'a001', type: 'HEAT', severity: 'danger', farmId: FARM_1, workplaceId: WP_1, workerId: WORKER_4, message: '작업자 정소영 체온 37.8℃ — 온열질환 경고', channels: ['sms', 'push', 'vest_vibration'], status: 'unacknowledged', acknowledgedAt: null, acknowledgedBy: null, createdAt: minutesAgo(15), farm: { id: FARM_1, name: '행복농장' }, worker: { id: WORKER_4, userId: 'u004' } },
  { id: 'a002', type: 'FALL', severity: 'warning', farmId: FARM_2, workplaceId: WP_3, workerId: WORKER_3, message: '작업자 박민수 급격한 자세 변화 감지 (가속도 4.2g)', channels: ['push'], status: 'acknowledged', acknowledgedAt: minutesAgo(10), acknowledgedBy: '관리자', createdAt: minutesAgo(25), farm: { id: FARM_2, name: '풍년과수원' }, worker: { id: WORKER_3, userId: 'u003' } },
  { id: 'a003', type: 'HEAT', severity: 'caution', farmId: FARM_1, workplaceId: WP_2, workerId: WORKER_1, message: 'WBGT 28.7℃ 주의 단계 — 작업 강도 조절 권장', channels: ['push'], status: 'acknowledged', acknowledgedAt: hoursAgo(1), acknowledgedBy: '관리자', createdAt: hoursAgo(2), farm: { id: FARM_1, name: '행복농장' }, worker: { id: WORKER_1, userId: 'u001' } },
  { id: 'a004', type: 'COLLISION', severity: 'warning', farmId: FARM_1, workplaceId: WP_2, workerId: WORKER_2, message: '작업자 이영희 — 농기계 접근 거리 3.2m', channels: ['vest_vibration', 'push'], status: 'resolved', acknowledgedAt: hoursAgo(3), acknowledgedBy: '관리자', createdAt: hoursAgo(4), farm: { id: FARM_1, name: '행복농장' }, worker: { id: WORKER_2, userId: 'u002' } },
  { id: 'a005', type: 'ENTANGLE', severity: 'caution', farmId: FARM_2, workplaceId: WP_3, workerId: null, message: '과수원 C구역 회전체 근접 센서 이상 감지', channels: ['push'], status: 'acknowledged', acknowledgedAt: hoursAgo(5), acknowledgedBy: '관리자', createdAt: hoursAgo(6), farm: { id: FARM_2, name: '풍년과수원' }, worker: null },
  { id: 'a006', type: 'FIRE', severity: 'danger', farmId: FARM_1, workplaceId: WP_1, workerId: null, message: 'A동 비닐하우스 전류 이상 감지 (22.5A)', channels: ['sms', 'push'], status: 'resolved', acknowledgedAt: hoursAgo(10), acknowledgedBy: '관리자', createdAt: hoursAgo(12), farm: { id: FARM_1, name: '행복농장' }, worker: null },
  { id: 'a007', type: 'HEAT', severity: 'warning', farmId: FARM_1, workplaceId: WP_2, workerId: WORKER_5, message: '작업자 최동현 심박수 118bpm 위험 수준', channels: ['sms', 'push', 'vest_vibration'], status: 'unacknowledged', acknowledgedAt: null, acknowledgedBy: null, createdAt: minutesAgo(5), farm: { id: FARM_1, name: '행복농장' }, worker: { id: WORKER_5, userId: 'u005' } },
  { id: 'a008', type: 'ROLLOVER', severity: 'caution', farmId: FARM_1, workplaceId: WP_2, workerId: null, message: '트랙터 Roll 각도 12° — 지형 주의', channels: ['push'], status: 'acknowledged', acknowledgedAt: hoursAgo(8), acknowledgedBy: '관리자', createdAt: hoursAgo(9), farm: { id: FARM_1, name: '행복농장' }, worker: null },
];

export const mockAlertRules = [
  { id: 'ar1', farmId: FARM_1, severity: 'danger', channels: ['sms', 'push', 'vest_vibration', 'ecall'], isActive: true, createdAt: daysAgo(60), updatedAt: daysAgo(1) },
  { id: 'ar2', farmId: FARM_1, severity: 'warning', channels: ['push', 'vest_vibration'], isActive: true, createdAt: daysAgo(60), updatedAt: daysAgo(1) },
  { id: 'ar3', farmId: FARM_1, severity: 'caution', channels: ['push'], isActive: true, createdAt: daysAgo(60), updatedAt: daysAgo(1) },
];

export const mockRecipients = [
  { id: 'rg1', farmId: FARM_1, name: '현장 관리자 그룹', severity: 'danger', alertType: null, userIds: ['u001', 'u002'], includeExternal: true, createdAt: daysAgo(30) },
  { id: 'rg2', farmId: FARM_1, name: '안전 담당자', severity: 'warning', alertType: null, userIds: ['u001'], includeExternal: false, createdAt: daysAgo(30) },
];

export const mockECallRecords = [
  { id: 'ec1', alertId: 'a001', farmId: FARM_1, workerId: WORKER_4, triggerType: 'auto', lat: 35.1795, lng: 129.0755, workerInfo: { name: '정소영', heartRate: 105, bodyTemp: 37.8 }, accidentType: 'HEAT', status: 'active', resolvedAt: null, createdAt: minutesAgo(15), farm: { id: FARM_1, name: '행복농장' }, worker: { id: WORKER_4, userId: 'u004' } },
  { id: 'ec2', alertId: 'a006', farmId: FARM_1, workerId: null, triggerType: 'manual', lat: 35.1801, lng: 129.0761, workerInfo: null, accidentType: 'FIRE', status: 'resolved', resolvedAt: hoursAgo(10), createdAt: hoursAgo(12), farm: { id: FARM_1, name: '행복농장' }, worker: null },
];

export const mockTemplates = [
  { id: 't1', alertType: 'HEAT', severity: 'danger', title: '온열질환 위험', messageTemplate: '작업자 {{workerName}}의 체온이 {{bodyTemp}}℃로 위험 수준입니다.', ttsTemplate: '온열질환 위험 알림', isActive: true, createdAt: daysAgo(30), updatedAt: daysAgo(5) },
  { id: 't2', alertType: 'FALL', severity: 'warning', title: '추락/넘어짐 경고', messageTemplate: '작업자 {{workerName}}에서 급격한 자세 변화가 감지되었습니다.', ttsTemplate: '추락 경고 알림', isActive: true, createdAt: daysAgo(30), updatedAt: daysAgo(5) },
  { id: 't3', alertType: 'COLLISION', severity: 'danger', title: '충돌 위험', messageTemplate: '{{workerName}} 작업자와 농기계의 거리가 {{distance}}m로 위험합니다.', ttsTemplate: null, isActive: true, createdAt: daysAgo(30), updatedAt: daysAgo(5) },
];

export const mockEscalationRules = [
  { id: 'es1', farmId: FARM_1, severity: 'danger', step: 1, waitMinutes: 3, targetType: 'farm_manager', targetUserIds: ['u001'], isActive: true, createdAt: daysAgo(30) },
  { id: 'es2', farmId: FARM_1, severity: 'danger', step: 2, waitMinutes: 5, targetType: 'admin', targetUserIds: null, isActive: true, createdAt: daysAgo(30) },
  { id: 'es3', farmId: FARM_1, severity: 'warning', step: 1, waitMinutes: 10, targetType: 'farm_manager', targetUserIds: ['u001'], isActive: true, createdAt: daysAgo(30) },
];

// ── AI 예측 ──
export const mockRealtimePredictions = [
  { modelType: 'FALL', label: '추락/넘어짐', prediction: 0.12, confidence: 0.91, latestId: 'p001' },
  { modelType: 'ENTANGLE', label: '끼임/감김', prediction: 0.08, confidence: 0.88, latestId: 'p002' },
  { modelType: 'HEAT', label: '온열질환', prediction: 0.67, confidence: 0.94, latestId: 'p003' },
  { modelType: 'FIRE', label: '전기화재', prediction: 0.15, confidence: 0.87, latestId: 'p004' },
  { modelType: 'ROLLOVER', label: '차량전복', prediction: 0.05, confidence: 0.93, latestId: 'p005' },
  { modelType: 'COLLISION', label: '충돌', prediction: 0.32, confidence: 0.89, latestId: 'p006' },
];

export const mockXaiResult = {
  predictionId: 'p003',
  modelType: 'HEAT',
  prediction: 0.67,
  xaiFactors: [
    { feature: 'WBGT 지수', contribution: 0.28 },
    { feature: '체온', contribution: 0.22 },
    { feature: '심박수', contribution: 0.15 },
    { feature: '작업 연속 시간', contribution: 0.12 },
    { feature: '순응도 수준', contribution: -0.08 },
    { feature: '습도', contribution: 0.06 },
    { feature: '풍속', contribution: -0.04 },
  ],
  llmMessage: '현재 WBGT 지수(28.7℃)가 경고 수준에 가깝고, 작업자의 체온(37.8℃)과 심박수(105bpm)가 상승하고 있습니다. 2시간 이상 연속 작업 중이므로 즉시 휴식이 권장됩니다.',
};

export const mockModelPerformance = [
  { modelType: 'FALL', label: '추락/넘어짐', accuracy: 0.954, auroc: 0.981, falseAlarmRate: 0.032, status: 'normal' as const, totalPredictions: 12840 },
  { modelType: 'ENTANGLE', label: '끼임/감김', accuracy: 0.938, auroc: 0.972, falseAlarmRate: 0.041, status: 'normal' as const, totalPredictions: 8520 },
  { modelType: 'HEAT', label: '온열질환', accuracy: 0.967, auroc: 0.989, falseAlarmRate: 0.028, status: 'normal' as const, totalPredictions: 15620 },
  { modelType: 'FIRE', label: '전기화재', accuracy: 0.945, auroc: 0.977, falseAlarmRate: 0.038, status: 'normal' as const, totalPredictions: 6340 },
  { modelType: 'ROLLOVER', label: '차량전복', accuracy: 0.921, auroc: 0.961, falseAlarmRate: 0.055, status: 'caution' as const, totalPredictions: 4280 },
  { modelType: 'COLLISION', label: '충돌', accuracy: 0.933, auroc: 0.968, falseAlarmRate: 0.047, status: 'normal' as const, totalPredictions: 9180 },
];

export const mockRiskAssessment = {
  id: 'ra001',
  farmId: FARM_1,
  workplaceId: WP_1,
  riskScore: 62,
  riskLevel: 'warning',
  hazards: [
    { code: 'HEAT', name: '온열질환', score: 72, source: 'sensor+vitals' },
    { code: 'FALL', name: '추락/넘어짐', score: 35, source: 'posture' },
    { code: 'COLLISION', name: '충돌', score: 48, source: 'proximity' },
  ],
  countermeasures: [
    { code: 'CM001', action: '작업 강도 하향 조정 및 15분 이내 휴식 실시', priority: 1 },
    { code: 'CM002', action: '작업장 환기 및 냉방 가동', priority: 2 },
    { code: 'CM003', action: '농기계 운행 시 경고음 확인', priority: 3 },
  ],
  assessedAt: minutesAgo(5),
  expiresAt: minutesAgo(-25),
  farm: { id: FARM_1, name: '행복농장' },
  workplace: { id: WP_1, name: 'A동 비닐하우스' },
};

export const mockRiskHistory = [
  { ...mockRiskAssessment, id: 'ra005', riskScore: 62, riskLevel: 'warning', assessedAt: minutesAgo(5) },
  { ...mockRiskAssessment, id: 'ra004', riskScore: 55, riskLevel: 'warning', assessedAt: minutesAgo(35) },
  { ...mockRiskAssessment, id: 'ra003', riskScore: 48, riskLevel: 'caution', assessedAt: hoursAgo(1) },
  { ...mockRiskAssessment, id: 'ra002', riskScore: 38, riskLevel: 'caution', assessedAt: hoursAgo(2) },
  { ...mockRiskAssessment, id: 'ra001', riskScore: 22, riskLevel: 'normal', assessedAt: hoursAgo(4) },
];

export const mockHazards = [
  { code: 'HEAT', name: '온열질환', score: 72, source: 'sensor+vitals' },
  { code: 'COLLISION', name: '농기계-작업자 충돌', score: 48, source: 'proximity' },
  { code: 'FALL', name: '추락/넘어짐', score: 35, source: 'posture' },
  { code: 'ENTANGLE', name: '끼임/감김', score: 22, source: 'camera' },
];

export const mockCountermeasures = [
  { code: 'CM001', action: '작업 강도 하향 조정 및 15분 이내 휴식 실시', priority: 1 },
  { code: 'CM002', action: '작업장 환기 및 냉방 가동', priority: 2 },
  { code: 'CM003', action: '농기계 운행 시 경고음 확인', priority: 3 },
  { code: 'CM004', action: '작업자 간 안전거리 유지 (5m 이상)', priority: 4 },
];

// ── 리포트/사고 ──
export const mockAccidents = [
  { id: 'ac1', type: 'HEAT', severity: 'warning', isNearMiss: false, farmId: FARM_1, workplaceId: WP_2, workerId: WORKER_4, occurredAt: daysAgo(3), description: '작업자 정소영 온열질환 증상 발생. 체온 38.1℃ 기록', cause: '연속 3시간 노지 작업, WBGT 30℃ 초과', actionsTaken: '즉시 응급 처치 및 그늘 휴식. 작업 중단', attachments: null, createdAt: daysAgo(3), farm: { id: FARM_1, name: '행복농장' }, workplace: { id: WP_2, name: 'B동 노지밭' }, worker: { id: WORKER_4, userId: 'u004' } },
  { id: 'ac2', type: 'FALL', severity: 'caution', isNearMiss: true, farmId: FARM_2, workplaceId: WP_3, workerId: WORKER_3, occurredAt: daysAgo(7), description: '사다리 작업 중 미끄러짐 (아차사고)', cause: '비 온 직후 사다리 미끄러움', actionsTaken: '미끄럼 방지 패드 설치', attachments: null, createdAt: daysAgo(7), farm: { id: FARM_2, name: '풍년과수원' }, workplace: { id: WP_3, name: '사과 과수원' }, worker: { id: WORKER_3, userId: 'u003' } },
  { id: 'ac3', type: 'ENTANGLE', severity: 'danger', isNearMiss: false, farmId: FARM_1, workplaceId: WP_1, workerId: WORKER_1, occurredAt: daysAgo(15), description: '비닐하우스 권취기에 작업복 끼임 사고', cause: '보호구 미착용, 안전거리 미확보', actionsTaken: '긴급 정지. 작업자 구출. 장비 안전장치 점검', attachments: null, createdAt: daysAgo(15), farm: { id: FARM_1, name: '행복농장' }, workplace: { id: WP_1, name: 'A동 비닐하우스' }, worker: { id: WORKER_1, userId: 'u001' } },
  { id: 'ac4', type: 'FIRE', severity: 'warning', isNearMiss: true, farmId: FARM_1, workplaceId: WP_1, workerId: null, occurredAt: daysAgo(22), description: '전기 배선 과부하로 연기 발생 (아차사고)', cause: '노후 배선, 용량 초과 전기 사용', actionsTaken: '전기 차단 및 배선 교체 완료', attachments: null, createdAt: daysAgo(22), farm: { id: FARM_1, name: '행복농장' }, workplace: { id: WP_1, name: 'A동 비닐하우스' }, worker: null },
  { id: 'ac5', type: 'COLLISION', severity: 'caution', isNearMiss: true, farmId: FARM_1, workplaceId: WP_2, workerId: WORKER_2, occurredAt: daysAgo(30), description: '트랙터 후진 시 작업자 근접 경고 (아차사고)', cause: '후방 미확인, 경고음 미작동', actionsTaken: '후방 감지 센서 재설치', attachments: null, createdAt: daysAgo(30), farm: { id: FARM_1, name: '행복농장' }, workplace: { id: WP_2, name: 'B동 노지밭' }, worker: { id: WORKER_2, userId: 'u002' } },
];

export const mockStatistics = {
  monthlyTrend: [
    { month: '2025-07', accidents: 2, nearMisses: 5 },
    { month: '2025-08', accidents: 3, nearMisses: 7 },
    { month: '2025-09', accidents: 1, nearMisses: 4 },
    { month: '2025-10', accidents: 2, nearMisses: 6 },
    { month: '2025-11', accidents: 1, nearMisses: 3 },
    { month: '2025-12', accidents: 0, nearMisses: 2 },
    { month: '2026-01', accidents: 1, nearMisses: 4 },
    { month: '2026-02', accidents: 1, nearMisses: 3 },
  ],
  typeDistribution: [
    { type: 'HEAT', label: '온열질환', count: 8, percentage: 32 },
    { type: 'FALL', label: '추락/넘어짐', count: 5, percentage: 20 },
    { type: 'COLLISION', label: '충돌', count: 4, percentage: 16 },
    { type: 'ENTANGLE', label: '끼임/감김', count: 4, percentage: 16 },
    { type: 'FIRE', label: '전기화재', count: 2, percentage: 8 },
    { type: 'ROLLOVER', label: '차량전복', count: 2, percentage: 8 },
  ],
  farmAlertFrequency: [
    { farmId: FARM_1, farmName: '행복농장', count: 15 },
    { farmId: FARM_2, farmName: '풍년과수원', count: 6 },
    { farmId: 'f0000003', farmName: '초록축산', count: 4 },
    { farmId: 'f0000004', farmName: '신선시설농장', count: 2 },
  ],
  hourlyHeatmap: (() => {
    const data: Array<{ day: number; dayLabel: string; hour: number; count: number }> = [];
    const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];
    for (let d = 0; d < 7; d++) {
      for (let h = 6; h < 20; h++) {
        data.push({
          day: d,
          dayLabel: dayLabels[d],
          hour: h,
          count: h >= 11 && h <= 15 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 2),
        });
      }
    }
    return data;
  })(),
  falseAlarmTrend: [
    { month: '2025-09', totalAlerts: 45, falseAlarms: 8, rate: 17.8 },
    { month: '2025-10', totalAlerts: 52, falseAlarms: 7, rate: 13.5 },
    { month: '2025-11', totalAlerts: 38, falseAlarms: 4, rate: 10.5 },
    { month: '2025-12', totalAlerts: 30, falseAlarms: 3, rate: 10.0 },
    { month: '2026-01', totalAlerts: 42, falseAlarms: 3, rate: 7.1 },
    { month: '2026-02', totalAlerts: 25, falseAlarms: 1, rate: 4.0 },
  ],
};

// ── 안전교육 ──
export const mockEduContents = [
  { id: 'edu1', title: '온열질환 예방 VR 체험', accidentType: 'HEAT', type: 'vr_content', simulatorType: 'heat_sim', version: '1.2', description: '고온 환경 작업 시 온열질환 대응 VR 시뮬레이션', durationMin: 20, difficulty: '중급', status: 'published', createdAt: daysAgo(60), updatedAt: daysAgo(5) },
  { id: 'edu2', title: '추락 방지 안전 교육', accidentType: 'FALL', type: 'classroom', simulatorType: null, version: '2.0', description: '사다리/고소 작업 시 안전 수칙 및 장비 사용법', durationMin: 30, difficulty: '초급', status: 'published', createdAt: daysAgo(90), updatedAt: daysAgo(10) },
  { id: 'edu3', title: '응급키트 사용법 실습', accidentType: 'HEAT', type: 'kit_training', simulatorType: null, version: '1.0', description: '거치형/탑재형 응급키트 개봉 및 구급 용품 사용 실습', durationMin: 45, difficulty: '초급', status: 'published', createdAt: daysAgo(45), updatedAt: daysAgo(2) },
  { id: 'edu4', title: '농기계 충돌 방지 VR', accidentType: 'COLLISION', type: 'vr_content', simulatorType: 'collision_sim', version: '1.1', description: '농기계 운행 중 작업자 충돌 방지 VR 체험', durationMin: 25, difficulty: '중급', status: 'published', createdAt: daysAgo(50), updatedAt: daysAgo(8) },
  { id: 'edu5', title: '전기화재 대응 교육', accidentType: 'FIRE', type: 'classroom', simulatorType: null, version: '1.0', description: '전기 안전 점검 및 화재 초기 대응 요령', durationMin: 40, difficulty: '초급', status: 'draft', createdAt: daysAgo(10), updatedAt: daysAgo(1) },
];

export const mockEduProgress = [
  {
    workerId: WORKER_1, workerName: '김철수', farmName: '행복농장', completionRate: 83,
    courses: [
      { accidentType: 'HEAT', contentTitle: '온열질환 예방 VR 체험', completed: true, score: 92, completedAt: daysAgo(10) },
      { accidentType: 'FALL', contentTitle: '추락 방지 안전 교육', completed: true, score: 88, completedAt: daysAgo(20) },
      { accidentType: 'HEAT', contentTitle: '응급키트 사용법 실습', completed: true, score: 95, completedAt: daysAgo(5) },
      { accidentType: 'COLLISION', contentTitle: '농기계 충돌 방지 VR', completed: true, score: 78, completedAt: daysAgo(15) },
      { accidentType: 'FIRE', contentTitle: '전기화재 대응 교육', completed: false, score: null, completedAt: null },
    ],
  },
  {
    workerId: WORKER_2, workerName: '이영희', farmName: '행복농장', completionRate: 60,
    courses: [
      { accidentType: 'HEAT', contentTitle: '온열질환 예방 VR 체험', completed: true, score: 85, completedAt: daysAgo(12) },
      { accidentType: 'FALL', contentTitle: '추락 방지 안전 교육', completed: true, score: 90, completedAt: daysAgo(25) },
      { accidentType: 'HEAT', contentTitle: '응급키트 사용법 실습', completed: false, score: null, completedAt: null },
      { accidentType: 'COLLISION', contentTitle: '농기계 충돌 방지 VR', completed: true, score: 72, completedAt: daysAgo(18) },
      { accidentType: 'FIRE', contentTitle: '전기화재 대응 교육', completed: false, score: null, completedAt: null },
    ],
  },
  {
    workerId: WORKER_3, workerName: '박민수', farmName: '풍년과수원', completionRate: 40,
    courses: [
      { accidentType: 'HEAT', contentTitle: '온열질환 예방 VR 체험', completed: true, score: 78, completedAt: daysAgo(30) },
      { accidentType: 'FALL', contentTitle: '추락 방지 안전 교육', completed: true, score: 65, completedAt: daysAgo(35) },
      { accidentType: 'HEAT', contentTitle: '응급키트 사용법 실습', completed: false, score: null, completedAt: null },
      { accidentType: 'COLLISION', contentTitle: '농기계 충돌 방지 VR', completed: false, score: null, completedAt: null },
      { accidentType: 'FIRE', contentTitle: '전기화재 대응 교육', completed: false, score: null, completedAt: null },
    ],
  },
];

export const mockAchievementAnalysis = {
  workerId: WORKER_1,
  workerName: '김철수',
  overallScore: 88,
  weaknesses: [
    { type: 'COLLISION', label: '충돌 예방', description: '농기계 접근 시 안전거리 인식 부족', severity: 'caution' },
  ],
  recommendedMissions: [
    { contentTitle: '농기계 충돌 방지 VR (심화)', reason: '충돌 예방 점수 78점 — 재교육 권장' },
    { contentTitle: '전기화재 대응 교육', reason: '미이수 과목' },
  ],
  trainingHistory: [
    { date: daysAgo(5), contentTitle: '응급키트 사용법 실습', score: 95 },
    { date: daysAgo(10), contentTitle: '온열질환 예방 VR 체험', score: 92 },
    { date: daysAgo(15), contentTitle: '농기계 충돌 방지 VR', score: 78 },
    { date: daysAgo(20), contentTitle: '추락 방지 안전 교육', score: 88 },
  ],
};

export const mockSchedules = [
  { id: 'sch1', title: '2월 정기 안전교육', farmId: FARM_1, contentIds: ['edu1', 'edu2'], instructorName: '안전관리사 홍길동', scheduledDate: daysAgo(-3), startTime: '09:00', endTime: '12:00', location: '행복농장 교육장', maxParticipants: 20, participantIds: [WORKER_1, WORKER_2, WORKER_4], status: 'scheduled', notes: null, createdAt: daysAgo(10), updatedAt: daysAgo(1) },
  { id: 'sch2', title: '응급키트 실습', farmId: FARM_2, contentIds: ['edu3'], instructorName: '응급처치 강사 김수진', scheduledDate: daysAgo(-7), startTime: '14:00', endTime: '16:00', location: '풍년과수원 현장', maxParticipants: 10, participantIds: [WORKER_3], status: 'scheduled', notes: '우천 시 연기', createdAt: daysAgo(5), updatedAt: daysAgo(1) },
  { id: 'sch3', title: '1월 신규 입사자 교육', farmId: FARM_1, contentIds: ['edu1', 'edu2', 'edu3'], instructorName: '안전관리사 홍길동', scheduledDate: daysAgo(20), startTime: '09:00', endTime: '17:00', location: '행복농장 교육장', maxParticipants: 15, participantIds: [WORKER_5], status: 'completed', notes: null, createdAt: daysAgo(30), updatedAt: daysAgo(20) },
];

export const mockSimulators = [
  { id: 'sim1', name: '4D 온열질환 시뮬레이터', simulatorType: 'heat_sim', location: '행복농장 교육장', status: 'active', totalSessions: 142, emergencyStops: 3, lastMaintenanceAt: daysAgo(15), firmwareVersion: 'v3.2.1', createdAt: daysAgo(180), updatedAt: daysAgo(1) },
  { id: 'sim2', name: '충돌 방지 VR 시뮬레이터', simulatorType: 'collision_sim', location: '풍년과수원 교육장', status: 'standby', totalSessions: 87, emergencyStops: 1, lastMaintenanceAt: daysAgo(30), firmwareVersion: 'v2.8.0', createdAt: daysAgo(120), updatedAt: daysAgo(5) },
  { id: 'sim3', name: '추락 방지 체험 장비', simulatorType: 'fall_sim', location: '행복농장 교육장', status: 'maintenance', totalSessions: 56, emergencyStops: 0, lastMaintenanceAt: daysAgo(2), firmwareVersion: 'v1.5.3', createdAt: daysAgo(90), updatedAt: daysAgo(2) },
];

export const mockKitTrainings = [
  { id: 'kt1', workerId: WORKER_1, farmId: FARM_1, trainingType: 'stationary', trainingDate: daysAgo(5), score: 95, passed: true, durationMin: 25, remarks: '우수', evaluatorName: '안전관리사 홍길동', createdAt: daysAgo(5) },
  { id: 'kt2', workerId: WORKER_2, farmId: FARM_1, trainingType: 'mounted', trainingDate: daysAgo(12), score: 72, passed: true, durationMin: 30, remarks: null, evaluatorName: '안전관리사 홍길동', createdAt: daysAgo(12) },
  { id: 'kt3', workerId: WORKER_3, farmId: FARM_2, trainingType: 'stationary', trainingDate: daysAgo(20), score: 55, passed: false, durationMin: 35, remarks: '재교육 필요', evaluatorName: '응급처치 강사 김수진', createdAt: daysAgo(20) },
];

// ── 시스템 관리 ──
export const mockUsers = [
  { id: 'u001', email: 'admin@example.com', name: '관리자', role: 'admin', phone: '010-1234-5678', farmId: null, isActive: true, createdAt: daysAgo(365), updatedAt: daysAgo(1) },
  { id: 'u002', email: 'farm1@example.com', name: '행복농장 관리자', role: 'farm_manager', phone: '010-2345-6789', farmId: FARM_1, isActive: true, createdAt: daysAgo(300), updatedAt: daysAgo(5) },
  { id: 'u003', email: 'farm2@example.com', name: '과수원 관리자', role: 'farm_manager', phone: '010-3456-7890', farmId: FARM_2, isActive: true, createdAt: daysAgo(250), updatedAt: daysAgo(3) },
  { id: 'u004', email: 'govt@example.com', name: '지자체 담당자', role: 'govt_manager', phone: '010-4567-8901', farmId: null, isActive: true, createdAt: daysAgo(200), updatedAt: daysAgo(10) },
  { id: 'u005', email: 'edu@example.com', name: '교육관리자', role: 'edu_manager', phone: '010-5678-9012', farmId: null, isActive: true, createdAt: daysAgo(180), updatedAt: daysAgo(7) },
  { id: 'u006', email: 'worker1@example.com', name: '김철수', role: 'worker', phone: '010-6789-0123', farmId: FARM_1, isActive: true, createdAt: daysAgo(150), updatedAt: daysAgo(1) },
  { id: 'u007', email: 'worker2@example.com', name: '이영희', role: 'worker', phone: '010-7890-1234', farmId: FARM_1, isActive: true, createdAt: daysAgo(140), updatedAt: daysAgo(1) },
  { id: 'u008', email: 'worker3@example.com', name: '박민수', role: 'worker', phone: '010-8901-2345', farmId: FARM_2, isActive: true, createdAt: daysAgo(120), updatedAt: daysAgo(1) },
  { id: 'u009', email: 'inactive@example.com', name: '퇴사자', role: 'worker', phone: null, farmId: null, isActive: false, createdAt: daysAgo(400), updatedAt: daysAgo(50) },
];

export const mockFarms = [
  { id: FARM_1, name: '행복농장', ownerId: 'u002', address: '경상남도 부산시 해운대구 123', lat: 35.1796, lng: 129.0756, farmType: '노지', area: 15000, phone: '055-123-4567', createdAt: daysAgo(300), updatedAt: daysAgo(5) },
  { id: FARM_2, name: '풍년과수원', ownerId: 'u003', address: '경상남도 부산시 기장군 456', lat: 35.185, lng: 129.082, farmType: '과수원', area: 8000, phone: '055-234-5678', createdAt: daysAgo(250), updatedAt: daysAgo(3) },
  { id: 'f0000003', name: '초록축산', ownerId: null, address: '경상남도 부산시 금정구 789', lat: 35.172, lng: 129.069, farmType: '축산', area: 20000, phone: '055-345-6789', createdAt: daysAgo(200), updatedAt: daysAgo(10) },
  { id: 'f0000004', name: '신선시설농장', ownerId: null, address: '경상남도 부산시 연제구 101', lat: 35.190, lng: 129.075, farmType: '시설', area: 5000, phone: '055-456-7890', createdAt: daysAgo(150), updatedAt: daysAgo(8) },
];

export const mockWorkplaces = [
  { id: WP_1, farmId: FARM_1, name: 'A동 비닐하우스', type: 'greenhouse', lat: 35.1800, lng: 129.0760, geofence: null, createdAt: daysAgo(280) },
  { id: WP_2, farmId: FARM_1, name: 'B동 노지밭', type: 'open_field', lat: 35.1790, lng: 129.0745, geofence: null, createdAt: daysAgo(280) },
  { id: WP_3, farmId: FARM_2, name: '사과 과수원', type: 'orchard', lat: 35.1855, lng: 129.0825, geofence: null, createdAt: daysAgo(240) },
];

export const mockAssetSummary = {
  smartVests: { total: 20, online: 16, offline: 3, error: 1, assigned: 17, unassigned: 3 },
  emergencyKits: { total: 8, normal: 6, opened: 1, alarm: 0, maintenance: 1 },
  sensors: { total: 32, online: 28, offline: 3, error: 0, calibrating: 1 },
};

export const mockSettings = [
  { key: 'system.name', value: '지능형 농작업 안전관리 플랫폼', description: '시스템 이름', group: 'general', valueType: 'string', updatedAt: daysAgo(30) },
  { key: 'alert.auto_escalation', value: 'true', description: '자동 에스컬레이션 활성화', group: 'alert', valueType: 'boolean', updatedAt: daysAgo(10) },
  { key: 'alert.danger_timeout_min', value: '3', description: '위험 등급 미확인 시 에스컬레이션 대기 시간(분)', group: 'alert', valueType: 'number', updatedAt: daysAgo(10) },
  { key: 'sensor.collection_interval_sec', value: '5', description: '센서 데이터 수집 주기(초)', group: 'sensor', valueType: 'number', updatedAt: daysAgo(20) },
  { key: 'ai.prediction_interval_sec', value: '30', description: 'AI 예측 실행 주기(초)', group: 'ai', valueType: 'number', updatedAt: daysAgo(15) },
  { key: 'risk.assessment_interval_min', value: '5', description: '동적 위험성평가 주기(분)', group: 'ai', valueType: 'number', updatedAt: daysAgo(15) },
  { key: 'worker.heat_threshold_temp', value: '37.5', description: '온열질환 체온 경고 기준(℃)', group: 'worker', valueType: 'number', updatedAt: daysAgo(20) },
  { key: 'worker.heart_rate_danger', value: '120', description: '심박수 위험 기준(bpm)', group: 'worker', valueType: 'number', updatedAt: daysAgo(20) },
];

export const mockApiKeys = [
  { id: 'ak1', name: '외부 기관 연동', keyPrefix: 'ask_prod_', description: '지자체 안전관리 시스템 연동용', status: 'active', allowedIps: ['210.123.45.0/24'], rateLimit: 1000, totalRequests: 15230, lastUsedAt: minutesAgo(30), expiresAt: daysAgo(-180), createdAt: daysAgo(90) },
  { id: 'ak2', name: '테스트 키', keyPrefix: 'ask_test_', description: '개발/테스트용 API 키', status: 'active', allowedIps: [], rateLimit: 100, totalRequests: 4520, lastUsedAt: hoursAgo(2), expiresAt: null, createdAt: daysAgo(30) },
];

export const mockAuditLogs = {
  data: [
    { id: 'log1', userId: 'u001', userEmail: 'admin@example.com', action: 'LOGIN', resource: 'auth', resourceId: null, ip: '192.168.0.10', statusCode: 200, durationMs: 125, createdAt: minutesAgo(5) },
    { id: 'log2', userId: 'u001', userEmail: 'admin@example.com', action: 'READ', resource: 'dashboard', resourceId: null, ip: '192.168.0.10', statusCode: 200, durationMs: 45, createdAt: minutesAgo(4) },
    { id: 'log3', userId: 'u002', userEmail: 'farm1@example.com', action: 'UPDATE', resource: 'worker', resourceId: WORKER_1, ip: '192.168.0.20', statusCode: 200, durationMs: 89, createdAt: minutesAgo(10) },
    { id: 'log4', userId: 'u001', userEmail: 'admin@example.com', action: 'CREATE', resource: 'alert_rule', resourceId: 'ar1', ip: '192.168.0.10', statusCode: 201, durationMs: 67, createdAt: minutesAgo(30) },
    { id: 'log5', userId: 'u002', userEmail: 'farm1@example.com', action: 'ACKNOWLEDGE', resource: 'alert', resourceId: 'a002', ip: '192.168.0.20', statusCode: 200, durationMs: 55, createdAt: minutesAgo(45) },
    { id: 'log6', userId: null, userEmail: null, action: 'API_CALL', resource: 'open-api', resourceId: null, ip: '210.123.45.12', statusCode: 200, durationMs: 230, createdAt: hoursAgo(1) },
    { id: 'log7', userId: 'u003', userEmail: 'farm2@example.com', action: 'READ', resource: 'report', resourceId: null, ip: '192.168.0.30', statusCode: 200, durationMs: 150, createdAt: hoursAgo(2) },
    { id: 'log8', userId: 'u001', userEmail: 'admin@example.com', action: 'DELETE', resource: 'user', resourceId: 'u009', ip: '192.168.0.10', statusCode: 200, durationMs: 78, createdAt: hoursAgo(3) },
    { id: 'log9', userId: null, userEmail: null, action: 'API_CALL', resource: 'open-api', resourceId: null, ip: '210.123.45.12', statusCode: 429, durationMs: 12, createdAt: hoursAgo(4) },
    { id: 'log10', userId: 'u005', userEmail: 'edu@example.com', action: 'CREATE', resource: 'education', resourceId: 'edu5', ip: '192.168.0.50', statusCode: 201, durationMs: 95, createdAt: hoursAgo(5) },
  ],
  total: 1254,
  page: 1,
  limit: 10,
};

// ── URL 기반 라우팅 맵 ──
// API 요청 URL에 따라 적절한 모의 데이터를 반환
export function getMockResponse(url: string, _method: string): unknown | null {
  // 대시보드
  if (url.includes('/dashboard/overview')) return mockDashboardOverview;
  if (url.includes('/dashboard/map')) return mockMapData;

  // 작업자
  if (url.match(/\/workers\/[^/]+\/vitals/)) return mockVitalsData();
  if (url.match(/\/workers\/[^/]+\/posture/)) return mockPosture;
  if (url.match(/\/workers\/[^/]+\/timeline/)) return mockTimeline;
  if (url.match(/\/workers\/[^/]+\/acclimatization/)) return mockAcclimatization;
  if (url.match(/\/workers\/[^/]+\/status/)) return mockWorkerStatus;

  // 디바이스
  if (url.match(/\/devices\/vests\/[^/]+$/) && _method === 'get') return mockVests[0];
  if (url.includes('/devices/vests')) return mockVests;
  if (url.match(/\/devices\/kits\/[^/]+\/events/)) return [];
  if (url.match(/\/devices\/kits\/[^/]+$/) && _method === 'get') return mockKits[0];
  if (url.includes('/devices/kits')) return mockKits;
  if (url.match(/\/devices\/sensors\/[^/]+\/data/)) return mockSensorData();
  if (url.match(/\/devices\/sensors\/[^/]+$/) && _method === 'get') return mockSensors[0];
  if (url.includes('/devices/sensors')) return mockSensors;

  // 알림
  if (url.includes('/alerts/rules')) return mockAlertRules;
  if (url.includes('/alerts/recipients')) return mockRecipients;
  if (url.includes('/alerts/templates')) return mockTemplates;
  if (url.includes('/alerts/escalation')) return mockEscalationRules;
  if (url.includes('/alerts/history') || url.match(/\/alerts$/)) return mockAlertHistory;
  if (url.includes('/ecall/history') || url.match(/\/ecall$/)) return mockECallRecords;

  // AI
  if (url.includes('/predictions/realtime')) return mockRealtimePredictions;
  if (url.match(/\/predictions\/[^/]+\/xai/)) return mockXaiResult;
  if (url.includes('/predictions/models/performance')) return mockModelPerformance;
  if (url.includes('/risk-assessment/current')) return mockRiskAssessment;
  if (url.includes('/risk-assessment/history')) return mockRiskHistory;
  if (url.includes('/risk-assessment/hazards')) return mockHazards;
  if (url.includes('/risk-assessment/countermeasures')) return mockCountermeasures;

  // 사고/리포트
  if (url.match(/\/accidents\/[^/]+$/) && _method === 'get') return mockAccidents[0];
  if (url.includes('/accidents')) return mockAccidents;
  if (url.includes('/reports/statistics')) return mockStatistics;

  // 교육
  if (url.includes('/education/contents')) return mockEduContents;
  if (url.includes('/education/progress')) return mockEduProgress;
  if (url.match(/\/education\/analysis\//)) return mockAchievementAnalysis;
  if (url.includes('/education/schedules')) return mockSchedules;
  if (url.includes('/education/simulators')) return mockSimulators;
  if (url.includes('/education/kit-training')) return mockKitTrainings;

  // 시스템
  if (url.includes('/users')) return mockUsers;
  if (url.match(/\/farms\/[^/]+\/workplaces/)) return mockWorkplaces;
  if (url.includes('/farms')) return mockFarms;
  if (url.includes('/assets/summary')) return mockAssetSummary;
  if (url.includes('/assets')) return {
    smartVests: mockVests.map(v => ({ ...v, lastSeen: v.lastHeartbeat })),
    emergencyKits: mockKits.map(k => ({ ...k, lastSeen: k.lastHeartbeat })),
    sensors: mockSensors.map(s => ({ ...s, name: s.serialNo, sensorType: s.type, lastSeen: s.lastHeartbeat, workplace: s.workplace ? { ...s.workplace, farm: { name: '행복농장' } } : null })),
  };
  if (url.includes('/settings')) return mockSettings;
  if (url.match(/\/api-keys\/[^/]+\/usage/)) return { keyId: 'ak1', totalRequests: 15230, lastUsedAt: minutesAgo(30), dailyUsage: Array.from({ length: 7 }, (_, i) => ({ date: daysAgo(6 - i).split('T')[0], count: 200 + Math.floor(Math.random() * 300) })) };
  if (url.includes('/api-keys')) return mockApiKeys;
  if (url.includes('/audit-logs')) return mockAuditLogs;

  return null;
}
