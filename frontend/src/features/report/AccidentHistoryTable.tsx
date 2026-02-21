import { useEffect, useState } from 'react';
import { reportService, type AccidentRecord, type AccidentQuery } from '@/services/reportService';
import { formatDateTime } from '@/utils/formatDate';

const TYPE_LABELS: Record<string, string> = {
  FALL: '추락/넘어짐', ENTANGLE: '끼임/감김', HEAT: '온열질환/질식',
  FIRE: '전기화재', ROLLOVER: '차량 전도/전복', COLLISION: '농기계-작업자 충돌', OTHER: '기타',
};

const SEVERITY_CONFIG: Record<string, { label: string; badge: string }> = {
  minor: { label: '경미', badge: 'bg-green-100 text-green-700' },
  moderate: { label: '보통', badge: 'bg-yellow-100 text-yellow-800' },
  severe: { label: '중대', badge: 'bg-orange-100 text-orange-800' },
  fatal: { label: '사망', badge: 'bg-red-100 text-red-700' },
};

interface Props {
  onEdit?: (record: AccidentRecord) => void;
}

export default function AccidentHistoryTable({ onEdit }: Props) {
  const [accidents, setAccidents] = useState<AccidentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AccidentQuery>({});

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await reportService.getAccidents(filter);
      setAccidents(data);
    } catch (err) {
      console.error('사고 이력 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await reportService.deleteAccident(id);
      await fetchData();
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  return (
    <div>
      {/* 필터 */}
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
          <option value="">심각도 전체</option>
          <option value="minor">경미</option>
          <option value="moderate">보통</option>
          <option value="severe">중대</option>
          <option value="fatal">사망</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-400">로딩 중...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-2 border-b font-medium text-gray-600">발생일시</th>
                <th className="text-left px-4 py-2 border-b font-medium text-gray-600">유형</th>
                <th className="text-center px-4 py-2 border-b font-medium text-gray-600">심각도</th>
                <th className="text-center px-4 py-2 border-b font-medium text-gray-600">구분</th>
                <th className="text-left px-4 py-2 border-b font-medium text-gray-600">농가</th>
                <th className="text-left px-4 py-2 border-b font-medium text-gray-600">사고 경위</th>
                <th className="text-center px-4 py-2 border-b font-medium text-gray-600">액션</th>
              </tr>
            </thead>
            <tbody>
              {accidents.map((a) => {
                const sev = SEVERITY_CONFIG[a.severity] ?? { label: a.severity, badge: 'bg-gray-100 text-gray-600' };
                return (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b text-gray-600 whitespace-nowrap">{formatDateTime(a.occurredAt)}</td>
                    <td className="px-4 py-2 border-b">{TYPE_LABELS[a.type] ?? a.type}</td>
                    <td className="text-center px-4 py-2 border-b">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${sev.badge}`}>{sev.label}</span>
                    </td>
                    <td className="text-center px-4 py-2 border-b">
                      {a.isNearMiss ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700">아차사고</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">사고</span>
                      )}
                    </td>
                    <td className="px-4 py-2 border-b">{a.farm?.name ?? '-'}</td>
                    <td className="px-4 py-2 border-b text-gray-600 max-w-xs truncate">{a.description ?? '-'}</td>
                    <td className="text-center px-4 py-2 border-b">
                      <button onClick={() => onEdit?.(a)} className="text-xs text-blue-600 hover:text-blue-800 mr-2">수정</button>
                      <button onClick={() => handleDelete(a.id)} className="text-xs text-red-600 hover:text-red-800">삭제</button>
                    </td>
                  </tr>
                );
              })}
              {accidents.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">사고 이력이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
