import { formatDateTime } from '@/utils/formatDate';
import { ACCIDENT_TYPE_LABELS } from '@/utils/constants';
import type { AccidentType } from '@/types';

export interface AlertTimelineItem {
  alertId: string;
  type: string;
  severity: 'info' | 'caution' | 'warning' | 'danger';
  message: string;
  workerName?: string;
  timestamp: string;
}

interface Props {
  alerts: AlertTimelineItem[];
}

const SEVERITY_STYLES: Record<string, { dot: string; bg: string }> = {
  danger: { dot: 'bg-risk-danger', bg: 'bg-red-50' },
  warning: { dot: 'bg-risk-warning', bg: 'bg-orange-50' },
  caution: { dot: 'bg-risk-caution', bg: 'bg-yellow-50' },
  info: { dot: 'bg-blue-400', bg: 'bg-blue-50' },
};

export default function AlertTimeline({ alerts }: Props) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        최근 알림 <span className="text-gray-400 font-normal">(24시간)</span>
      </h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">최근 알림이 없습니다</p>
        ) : (
          alerts.map((alert) => {
            const style = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info;
            const typeLabel =
              ACCIDENT_TYPE_LABELS[alert.type as AccidentType] || alert.type;

            return (
              <div
                key={alert.alertId}
                className={`rounded-lg p-3 flex items-start gap-3 ${style.bg} cursor-pointer hover:opacity-80`}
              >
                <span className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${style.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">{typeLabel}</span>
                    <span className="text-xs text-gray-400">
                      {formatDateTime(alert.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{alert.message}</p>
                  {alert.workerName && (
                    <p className="text-xs text-gray-400 mt-0.5">작업자: {alert.workerName}</p>
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
