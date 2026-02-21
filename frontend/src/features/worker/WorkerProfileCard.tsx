import type { WorkerStatus } from '@/services/workerService';

const RISK_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  normal: { bg: 'bg-green-100', text: 'text-green-700', label: '정상' },
  caution: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '주의' },
  warning: { bg: 'bg-orange-100', text: 'text-orange-800', label: '경고' },
  danger: { bg: 'bg-red-100', text: 'text-red-700', label: '위험' },
};

const ACCLIM_LABELS: Record<string, string> = {
  A: 'A (완전순응)',
  B: 'B (부분순응)',
  C: 'C (미순응)',
};

const GENDER_LABELS: Record<string, string> = { M: '남', F: '여' };

interface Props {
  status: WorkerStatus;
}

export default function WorkerProfileCard({ status }: Props) {
  const { worker, vest, vitals, riskLevel } = status;
  const risk = RISK_COLORS[riskLevel] ?? RISK_COLORS.normal;

  return (
    <div className="bg-white rounded-lg border p-5 space-y-4">
      {/* 이름/나이 */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-lg font-bold">
          {worker.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{worker.name}</h3>
          <p className="text-sm text-gray-500">
            {worker.age ? `${worker.age}세` : '-'}
            {worker.gender ? ` / ${GENDER_LABELS[worker.gender] ?? worker.gender}` : ''}
          </p>
        </div>
      </div>

      {/* 정보 항목 */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">소속 농가</span>
          <span className="font-medium text-gray-900">{worker.farmName || '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">열순응도</span>
          <span className="font-medium text-gray-900">
            {worker.acclimatizationLevel ? ACCLIM_LABELS[worker.acclimatizationLevel] ?? worker.acclimatizationLevel : '-'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">조끼 상태</span>
          <span className={`font-medium ${vest ? (vest.commStatus === 'online' ? 'text-green-600' : 'text-red-600') : 'text-gray-400'}`}>
            {vest ? `${vest.commStatus === 'online' ? '정상' : '오프라인'} (${vest.batteryLevel}%)` : '미착용'}
          </span>
        </div>
      </div>

      {/* 생체신호 요약 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-md p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">심박수</p>
          <p className={`text-xl font-bold ${vitals.heartRate && vitals.heartRate > 100 ? 'text-red-600' : 'text-gray-900'}`}>
            {vitals.heartRate ?? '-'}
            <span className="text-xs font-normal text-gray-400 ml-1">bpm</span>
          </p>
        </div>
        <div className="bg-gray-50 rounded-md p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">체온</p>
          <p className={`text-xl font-bold ${vitals.bodyTemp && vitals.bodyTemp > 37.8 ? 'text-red-600' : 'text-gray-900'}`}>
            {vitals.bodyTemp ?? '-'}
            <span className="text-xs font-normal text-gray-400 ml-1">&deg;C</span>
          </p>
        </div>
      </div>

      {/* 위험등급 */}
      <div className={`rounded-md p-3 text-center ${risk.bg}`}>
        <span className={`text-sm font-bold ${risk.text}`}>{risk.label}</span>
      </div>
    </div>
  );
}
