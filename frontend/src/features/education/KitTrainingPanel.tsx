import { useEffect, useState } from 'react';
import { educationService, type KitTrainingRecord } from '@/services/educationService';

const TYPE_LABELS: Record<string, string> = { stationary: '거치형', mounted: '탑재형' };

export default function KitTrainingPanel() {
  const [records, setRecords] = useState<KitTrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setRecords(await educationService.getKitTrainings()); }
      catch (e) { console.error('키트 실습 로드 실패:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">실습 기록 로딩 중...</div>;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-3 py-2 font-medium text-gray-600">작업자 ID</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">키트 유형</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">실습일</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">점수</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">합격</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">소요시간</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">평가자</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">비고</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-900 font-mono text-xs">{r.workerId.slice(0, 8)}</td>
                <td className="px-3 py-2 text-gray-600">{TYPE_LABELS[r.trainingType] ?? r.trainingType}</td>
                <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                  {r.trainingDate?.slice(0, 10)}
                </td>
                <td className="text-center px-3 py-2">
                  <span className={`font-semibold ${(r.score ?? 0) >= 80 ? 'text-green-600' : (r.score ?? 0) >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {r.score ?? '-'}
                  </span>
                </td>
                <td className="text-center px-3 py-2">
                  {r.passed ? (
                    <span className="text-green-600 font-medium">합격</span>
                  ) : (
                    <span className="text-red-500 font-medium">불합격</span>
                  )}
                </td>
                <td className="text-center px-3 py-2 text-gray-600">{r.durationMin ? `${r.durationMin}분` : '-'}</td>
                <td className="px-3 py-2 text-gray-600">{r.evaluatorName ?? '-'}</td>
                <td className="px-3 py-2 text-gray-500 text-xs max-w-[200px] truncate">{r.remarks ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {records.length === 0 && (
        <div className="text-center text-gray-400 py-12">실습 기록이 없습니다.</div>
      )}
    </div>
  );
}
