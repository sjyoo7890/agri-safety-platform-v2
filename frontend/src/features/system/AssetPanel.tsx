import { useEffect, useState } from 'react';
import { systemService, type AssetSummary, type AssetItem } from '@/services/systemService';

const CATEGORY_LABELS: Record<string, string> = {
  smart_vest: '스마트 조끼', emergency_kit: '응급키트', sensor: '환경센서',
};
const STATUS_STYLES: Record<string, string> = {
  online: 'bg-green-100 text-green-700',
  offline: 'bg-gray-100 text-gray-500',
  error: 'bg-red-100 text-red-700',
  calibrating: 'bg-yellow-100 text-yellow-700',
  normal: 'bg-green-100 text-green-700',
  opened: 'bg-blue-100 text-blue-700',
  alarm: 'bg-red-100 text-red-700',
  maintenance: 'bg-yellow-100 text-yellow-700',
  assigned: 'bg-blue-100 text-blue-700',
  unassigned: 'bg-gray-100 text-gray-500',
};

export default function AssetPanel() {
  const [summary, setSummary] = useState<AssetSummary | null>(null);
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [s, a] = await Promise.all([
          systemService.getAssetSummary(),
          systemService.getAssetList(),
        ]);
        setSummary(s);
        setAssets(a);
      } catch (e) { console.error('자산 로드 실패:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">자산 정보 로딩 중...</div>;

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">스마트 조끼</h4>
            <div className="text-2xl font-bold text-blue-600 mb-2">{summary.smartVests.total}대</div>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
              <div>온라인: <span className="text-green-600 font-medium">{summary.smartVests.online}</span></div>
              <div>오프라인: <span className="text-gray-400 font-medium">{summary.smartVests.offline}</span></div>
              <div>오류: <span className="text-red-600 font-medium">{summary.smartVests.error}</span></div>
              <div>미할당: <span className="text-gray-400 font-medium">{summary.smartVests.unassigned}</span></div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">응급키트</h4>
            <div className="text-2xl font-bold text-green-600 mb-2">{summary.emergencyKits.total}대</div>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
              <div>정상: <span className="text-green-600 font-medium">{summary.emergencyKits.normal}</span></div>
              <div>개봉: <span className="text-blue-600 font-medium">{summary.emergencyKits.opened}</span></div>
              <div>알람: <span className="text-red-600 font-medium">{summary.emergencyKits.alarm}</span></div>
              <div>점검: <span className="text-yellow-600 font-medium">{summary.emergencyKits.maintenance}</span></div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">환경센서</h4>
            <div className="text-2xl font-bold text-purple-600 mb-2">{summary.sensors.total}대</div>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
              <div>온라인: <span className="text-green-600 font-medium">{summary.sensors.online}</span></div>
              <div>오프라인: <span className="text-gray-400 font-medium">{summary.sensors.offline}</span></div>
              <div>오류: <span className="text-red-600 font-medium">{summary.sensors.error}</span></div>
              <div>교정중: <span className="text-yellow-600 font-medium">{summary.sensors.calibrating}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* 자산 목록 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-3 py-2 font-medium text-gray-600">장비명</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">카테고리</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">상태</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">농장</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">할당 작업자</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">최근 접속</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900">{a.name}</td>
                <td className="text-center px-3 py-2 text-gray-600 text-xs">{CATEGORY_LABELS[a.category] ?? a.category}</td>
                <td className="text-center px-3 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[a.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-gray-600 text-xs">{a.farmName ?? '-'}</td>
                <td className="px-3 py-2 text-gray-600 text-xs">{a.workerName ?? '-'}</td>
                <td className="text-center px-3 py-2 text-gray-500 text-xs">{a.lastSeen?.slice(0, 16).replace('T', ' ') ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {assets.length === 0 && <div className="text-center text-gray-400 py-8">등록된 장비가 없습니다.</div>}
    </div>
  );
}
