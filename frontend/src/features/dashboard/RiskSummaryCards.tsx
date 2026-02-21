import type { RiskSummary } from '@/services/dashboardService';

interface Props {
  data: RiskSummary | null;
}

const CARDS = [
  { key: 'normal' as const, label: '정상', color: 'border-risk-normal', textColor: 'text-risk-normal' },
  { key: 'caution' as const, label: '주의', color: 'border-risk-caution', textColor: 'text-risk-caution' },
  { key: 'warning' as const, label: '경고', color: 'border-risk-warning', textColor: 'text-risk-warning' },
  { key: 'danger' as const, label: '위험', color: 'border-risk-danger', textColor: 'text-risk-danger' },
];

export default function RiskSummaryCards({ data }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {CARDS.map(({ key, label, color, textColor }) => (
        <div
          key={key}
          className={`bg-white rounded-lg shadow p-4 border-l-4 ${color}`}
        >
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${textColor}`}>
            {data ? data[key] : '-'}
          </p>
        </div>
      ))}
    </div>
  );
}
