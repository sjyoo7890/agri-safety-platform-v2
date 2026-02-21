import { useEffect, useState } from 'react';
import { educationService, type SimulatorItem } from '@/services/educationService';

const SIM_TYPE_LABELS: Record<string, string> = { six_axis: '6축 탑승형', treadmill: '트레드밀형' };
const STATUS_LABELS: Record<string, string> = {
  active: '가동중', standby: '대기', maintenance: '점검중', error: '오류',
};
const STATUS_STYLES: Record<string, { dot: string; bg: string }> = {
  active: { dot: 'bg-green-500', bg: 'bg-green-50' },
  standby: { dot: 'bg-blue-400', bg: 'bg-blue-50' },
  maintenance: { dot: 'bg-yellow-500', bg: 'bg-yellow-50' },
  error: { dot: 'bg-red-500', bg: 'bg-red-50' },
};

export default function SimulatorPanel() {
  const [simulators, setSimulators] = useState<SimulatorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setSimulators(await educationService.getSimulators()); }
      catch (e) { console.error('시뮬레이터 로드 실패:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">시뮬레이터 로딩 중...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {simulators.map((s) => {
        const style = STATUS_STYLES[s.status] ?? STATUS_STYLES.standby;
        return (
          <div key={s.id} className={`rounded-lg border p-4 ${style.bg}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-3 h-3 rounded-full ${style.dot} ${s.status === 'active' ? 'animate-pulse' : ''}`} />
              <h4 className="text-sm font-semibold text-gray-900">{s.name}</h4>
            </div>
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>유형</span>
                <span className="font-medium">{SIM_TYPE_LABELS[s.simulatorType] ?? s.simulatorType}</span>
              </div>
              <div className="flex justify-between">
                <span>상태</span>
                <span className="font-medium">{STATUS_LABELS[s.status] ?? s.status}</span>
              </div>
              <div className="flex justify-between">
                <span>위치</span>
                <span className="font-medium">{s.location ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span>총 가동</span>
                <span className="font-medium">{s.totalSessions.toLocaleString()}회</span>
              </div>
              <div className="flex justify-between">
                <span>비상정지</span>
                <span className={`font-medium ${s.emergencyStops > 0 ? 'text-red-600' : ''}`}>
                  {s.emergencyStops}회
                </span>
              </div>
              <div className="flex justify-between">
                <span>펌웨어</span>
                <span className="font-medium">{s.firmwareVersion ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span>최근 점검</span>
                <span className="font-medium">{s.lastMaintenanceAt?.slice(0, 10) ?? '-'}</span>
              </div>
            </div>
          </div>
        );
      })}
      {simulators.length === 0 && (
        <div className="col-span-full text-center text-gray-400 py-12">등록된 시뮬레이터가 없습니다.</div>
      )}
    </div>
  );
}
