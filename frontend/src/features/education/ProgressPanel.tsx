import { useEffect, useState } from 'react';
import { educationService, type WorkerProgress } from '@/services/educationService';

const ACCIDENT_TYPES = ['FALL', 'ENTANGLE', 'HEAT', 'FIRE', 'ROLLOVER', 'COLLISION'];
const ACCIDENT_SHORT: Record<string, string> = {
  FALL: '추락', ENTANGLE: '끼임', HEAT: '온열', FIRE: '화재', ROLLOVER: '전복', COLLISION: '충돌',
};

export default function ProgressPanel() {
  const [data, setData] = useState<WorkerProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setData(await educationService.getProgress()); }
      catch (e) { console.error('이수 현황 로드 실패:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">이수 현황 로딩 중...</div>;

  const totalWorkers = data.length;
  const uncompleted = data.filter((w) => w.completionRate < 100).length;
  const avgRate = totalWorkers > 0 ? Math.round(data.reduce((s, w) => s + w.completionRate, 0) / totalWorkers) : 0;

  return (
    <div className="space-y-4">
      {/* 요약 */}
      <div className="flex gap-4 text-sm">
        <div className="bg-blue-50 rounded-lg px-4 py-2">
          <span className="text-gray-500">총 작업자</span>
          <span className="ml-2 font-semibold text-blue-700">{totalWorkers}명</span>
        </div>
        <div className="bg-orange-50 rounded-lg px-4 py-2">
          <span className="text-gray-500">미이수자</span>
          <span className="ml-2 font-semibold text-orange-700">{uncompleted}명</span>
        </div>
        <div className="bg-green-50 rounded-lg px-4 py-2">
          <span className="text-gray-500">평균 완료율</span>
          <span className="ml-2 font-semibold text-green-700">{avgRate}%</span>
        </div>
      </div>

      {/* 이수 현황 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-3 py-2 font-medium text-gray-600">이름</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">농장</th>
              {ACCIDENT_TYPES.map((t) => (
                <th key={t} className="text-center px-2 py-2 font-medium text-gray-600">{ACCIDENT_SHORT[t]}</th>
              ))}
              <th className="text-center px-3 py-2 font-medium text-gray-600">완료율</th>
            </tr>
          </thead>
          <tbody>
            {data.map((w) => (
              <tr key={w.workerId} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900">{w.workerName}</td>
                <td className="px-3 py-2 text-gray-600">{w.farmName}</td>
                {ACCIDENT_TYPES.map((type) => {
                  const course = w.courses.find((c) => c.accidentType === type);
                  return (
                    <td key={type} className="text-center px-2 py-2">
                      {course?.completed ? (
                        <span className="text-green-600" title={`${course.score}점`}>
                          ✅{course.score}
                        </span>
                      ) : (
                        <span className="text-gray-300">⬜</span>
                      )}
                    </td>
                  );
                })}
                <td className="text-center px-3 py-2">
                  <span className={`font-semibold ${w.completionRate === 100 ? 'text-green-600' : w.completionRate >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                    {w.completionRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="text-center text-gray-400 py-12">이수 기록이 없습니다.</div>
      )}
    </div>
  );
}
