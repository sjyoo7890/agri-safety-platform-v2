import { useEffect, useState } from 'react';
import { alertService, type AlertHistory, type AlertHistoryQuery } from '@/services/alertService';
import { useAuthStore } from '@/stores/authStore';
import { formatDateTime } from '@/utils/formatDate';

const SEVERITY_BADGES: Record<string, string> = {
  info: 'bg-blue-100 text-blue-700',
  caution: 'bg-yellow-100 text-yellow-800',
  warning: 'bg-orange-100 text-orange-800',
  danger: 'bg-red-100 text-red-800',
};

const SEVERITY_LABELS: Record<string, string> = {
  info: '정보',
  caution: '주의',
  warning: '경고',
  danger: '위험',
};

const STATUS_LABELS: Record<string, string> = {
  sent: '발송',
  acknowledged: '확인',
  escalated: '에스컬레이션',
  resolved: '해결',
};

const TYPE_LABELS: Record<string, string> = {
  FALL: '추락/넘어짐',
  ENTANGLE: '끼임/감김',
  HEAT: '온열질환/질식',
  FIRE: '전기화재',
  ROLLOVER: '차량 전도/전복',
  COLLISION: '농기계-작업자 충돌',
  DEVICE: '디바이스',
  SYSTEM: '시스템',
};

export default function AlertHistoryTable() {
  const user = useAuthStore((s) => s.user);
  const [alerts, setAlerts] = useState<AlertHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AlertHistoryQuery>({});

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await alertService.getAlertHistory(filter);
      setAlerts(data);
    } catch (err) {
      console.error('알림 이력 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (id: string) => {
    if (!user?.id) return;
    try {
      await alertService.acknowledgeAlert(id, user.id);
      await fetchHistory();
    } catch (err) {
      console.error('수신확인 실패:', err);
    }
  };

  return (
    <div>
      {/* 필터 영역 */}
      <div className="flex flex-wrap gap-3 mb-4">
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
        <select
          value={filter.type ?? ''}
          onChange={(e) => setFilter({ ...filter, type: e.target.value || undefined })}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          <option value="">유형 전체</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          value={filter.severity ?? ''}
          onChange={(e) => setFilter({ ...filter, severity: e.target.value || undefined })}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          <option value="">등급 전체</option>
          <option value="caution">주의</option>
          <option value="warning">경고</option>
          <option value="danger">위험</option>
        </select>
        <select
          value={filter.status ?? ''}
          onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          <option value="">상태 전체</option>
          <option value="sent">발송</option>
          <option value="acknowledged">확인</option>
          <option value="escalated">에스컬레이션</option>
          <option value="resolved">해결</option>
        </select>
      </div>

      {/* 테이블 */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-400">로딩 중...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-2 border-b font-medium text-gray-600">시간</th>
                <th className="text-left px-4 py-2 border-b font-medium text-gray-600">유형</th>
                <th className="text-center px-4 py-2 border-b font-medium text-gray-600">등급</th>
                <th className="text-left px-4 py-2 border-b font-medium text-gray-600">메시지</th>
                <th className="text-center px-4 py-2 border-b font-medium text-gray-600">상태</th>
                <th className="text-center px-4 py-2 border-b font-medium text-gray-600">액션</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b text-gray-600 whitespace-nowrap">
                    {formatDateTime(a.createdAt)}
                  </td>
                  <td className="px-4 py-2 border-b">{TYPE_LABELS[a.type] ?? a.type}</td>
                  <td className="text-center px-4 py-2 border-b">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${SEVERITY_BADGES[a.severity] ?? 'bg-gray-100 text-gray-600'}`}>
                      {SEVERITY_LABELS[a.severity] ?? a.severity}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b text-gray-700 max-w-xs truncate">{a.message}</td>
                  <td className="text-center px-4 py-2 border-b">
                    <span className="text-xs text-gray-500">{STATUS_LABELS[a.status] ?? a.status}</span>
                  </td>
                  <td className="text-center px-4 py-2 border-b">
                    {a.status === 'sent' && (
                      <button
                        onClick={() => handleAcknowledge(a.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        수신확인
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {alerts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">알림 이력이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
