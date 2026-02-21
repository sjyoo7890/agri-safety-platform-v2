import { RISK_LEVEL_CONFIG } from '@/utils/constants';
import type { RiskLevel } from '@/types';

export interface WorkerStatusItem {
  workerId: string;
  name: string;
  status: 'active' | 'resting' | 'danger' | 'offline';
  heartRate?: number;
  bodyTemp?: number;
  riskLevel: RiskLevel;
}

interface Props {
  workers: WorkerStatusItem[];
}

const STATUS_LABELS: Record<string, { label: string; dot: string }> = {
  active: { label: '활동중', dot: 'bg-risk-normal' },
  resting: { label: '휴식', dot: 'bg-gray-400' },
  danger: { label: '위험', dot: 'bg-risk-danger' },
  offline: { label: '오프라인', dot: 'bg-gray-300' },
};

export default function WorkerStatusList({ workers }: Props) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        작업자 상태 <span className="text-gray-400 font-normal">({workers.length}명)</span>
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {workers.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">등록된 작업자가 없습니다</p>
        ) : (
          workers.map((w) => {
            const st = STATUS_LABELS[w.status] || STATUS_LABELS.offline;
            const riskColor = RISK_LEVEL_CONFIG[w.riskLevel]?.color || '#22C55E';

            return (
              <div
                key={w.workerId}
                className="bg-white rounded-lg shadow p-3 flex items-center justify-between border-l-4 cursor-pointer hover:bg-gray-50"
                style={{ borderLeftColor: riskColor }}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                  <span className="text-sm font-medium">{w.name}</span>
                  <span className="text-xs text-gray-400">{st.label}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {w.heartRate != null && (
                    <span>
                      <span className="text-red-400">&#9829;</span> {w.heartRate}bpm
                    </span>
                  )}
                  {w.bodyTemp != null && (
                    <span>{w.bodyTemp.toFixed(1)}℃</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
