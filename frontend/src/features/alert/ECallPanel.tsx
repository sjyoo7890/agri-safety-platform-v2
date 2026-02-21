import { useEffect, useState } from 'react';
import { alertService, type ECallRecord } from '@/services/alertService';
import { formatDateTime } from '@/utils/formatDate';

const TRIGGER_LABELS: Record<string, string> = {
  auto: '자동',
  manual: '수동',
  device: '디바이스',
};

const STATUS_LABELS: Record<string, string> = {
  triggered: '발동',
  dispatched: '출동',
  resolved: '종료',
  cancelled: '취소',
};

const STATUS_COLORS: Record<string, string> = {
  triggered: 'bg-red-100 text-red-700',
  dispatched: 'bg-orange-100 text-orange-700',
  resolved: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const TYPE_LABELS: Record<string, string> = {
  FALL: '추락/넘어짐',
  ENTANGLE: '끼임/감김',
  HEAT: '온열질환/질식',
  FIRE: '전기화재',
  ROLLOVER: '차량 전도/전복',
  COLLISION: '농기계-작업자 충돌',
};

interface Props {
  farmId?: string;
}

export default function ECallPanel({ farmId }: Props) {
  const [ecalls, setEcalls] = useState<ECallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [farmId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await alertService.getECallHistory(farmId);
      setEcalls(data);
    } catch (err) {
      console.error('E-Call 이력 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrigger = async () => {
    if (!farmId) return;
    if (!confirm('E-Call 긴급 호출을 발동하시겠습니까?')) return;
    setTriggering(true);
    try {
      await alertService.createECall({ triggerType: 'manual', farmId });
      await fetchHistory();
    } catch (err) {
      console.error('E-Call 발동 실패:', err);
    } finally {
      setTriggering(false);
    }
  };

  const handleResolve = async (id: string) => {
    if (!confirm('E-Call을 종료 처리하시겠습니까?')) return;
    try {
      await alertService.resolveECall(id);
      await fetchHistory();
    } catch (err) {
      console.error('E-Call 종료 실패:', err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">로딩 중...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">E-Call 긴급 호출</h3>
        <button
          onClick={handleTrigger}
          disabled={triggering || !farmId}
          className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 font-medium"
        >
          {triggering ? '발동 중...' : 'E-Call 발동'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-2 border-b font-medium text-gray-600">시간</th>
              <th className="text-center px-4 py-2 border-b font-medium text-gray-600">트리거</th>
              <th className="text-left px-4 py-2 border-b font-medium text-gray-600">사고유형</th>
              <th className="text-left px-4 py-2 border-b font-medium text-gray-600">위치</th>
              <th className="text-center px-4 py-2 border-b font-medium text-gray-600">상태</th>
              <th className="text-left px-4 py-2 border-b font-medium text-gray-600">종료시간</th>
              <th className="text-center px-4 py-2 border-b font-medium text-gray-600">액션</th>
            </tr>
          </thead>
          <tbody>
            {ecalls.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-gray-600 whitespace-nowrap">
                  {formatDateTime(e.createdAt)}
                </td>
                <td className="text-center px-4 py-2 border-b">{TRIGGER_LABELS[e.triggerType] ?? e.triggerType}</td>
                <td className="px-4 py-2 border-b">{e.accidentType ? (TYPE_LABELS[e.accidentType] ?? e.accidentType) : '-'}</td>
                <td className="px-4 py-2 border-b text-gray-600">
                  {e.lat && e.lng ? `${e.lat.toFixed(4)}, ${e.lng.toFixed(4)}` : '-'}
                </td>
                <td className="text-center px-4 py-2 border-b">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[e.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {STATUS_LABELS[e.status] ?? e.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b text-gray-600">
                  {e.resolvedAt ? formatDateTime(e.resolvedAt) : '-'}
                </td>
                <td className="text-center px-4 py-2 border-b">
                  {(e.status === 'triggered' || e.status === 'dispatched') && (
                    <button
                      onClick={() => handleResolve(e.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      종료
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {ecalls.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">E-Call 이력이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
