import { useEffect, useState } from 'react';
import { aiService, type RiskAssessmentResult } from '@/services/aiService';
import { formatDateTime } from '@/utils/formatDate';

const RISK_BADGES: Record<string, string> = {
  normal: 'bg-green-100 text-green-700',
  caution: 'bg-yellow-100 text-yellow-800',
  warning: 'bg-orange-100 text-orange-800',
  danger: 'bg-red-100 text-red-700',
};

const RISK_LABELS: Record<string, string> = {
  normal: '정상',
  caution: '주의',
  warning: '경고',
  danger: '위험',
};

export default function RiskHistoryTable() {
  const [history, setHistory] = useState<RiskAssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ from?: string; to?: string }>({});

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await aiService.getRiskHistory(filter);
      setHistory(data);
    } catch (err) {
      console.error('위험성평가 이력 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">위험성평가 이력</h3>

      {/* 필터 */}
      <div className="flex gap-3 mb-4">
        <input
          type="date"
          value={filter.from ?? ''}
          onChange={(e) => setFilter({ ...filter, from: e.target.value || undefined })}
          className="border rounded-md px-3 py-1.5 text-sm"
        />
        <span className="text-gray-400 self-center">~</span>
        <input
          type="date"
          value={filter.to ?? ''}
          onChange={(e) => setFilter({ ...filter, to: e.target.value || undefined })}
          className="border rounded-md px-3 py-1.5 text-sm"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-400">로딩 중...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-2 border-b font-medium text-gray-600">평가 시간</th>
                <th className="text-left px-4 py-2 border-b font-medium text-gray-600">농가</th>
                <th className="text-left px-4 py-2 border-b font-medium text-gray-600">작업장</th>
                <th className="text-center px-4 py-2 border-b font-medium text-gray-600">점수</th>
                <th className="text-center px-4 py-2 border-b font-medium text-gray-600">등급</th>
                <th className="text-left px-4 py-2 border-b font-medium text-gray-600">위험요인</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b text-gray-600 whitespace-nowrap">
                    {formatDateTime(h.assessedAt)}
                  </td>
                  <td className="px-4 py-2 border-b">{h.farm?.name ?? '-'}</td>
                  <td className="px-4 py-2 border-b">{h.workplace?.name ?? '-'}</td>
                  <td className="text-center px-4 py-2 border-b font-bold text-gray-900">{h.riskScore}</td>
                  <td className="text-center px-4 py-2 border-b">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${RISK_BADGES[h.riskLevel] ?? 'bg-gray-100 text-gray-500'}`}>
                      {RISK_LABELS[h.riskLevel] ?? h.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b text-gray-600 text-xs max-w-xs truncate">
                    {h.hazards?.map((hz) => hz.name).join(', ') ?? '-'}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">위험성평가 이력이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
