import { useEffect, useState } from 'react';
import { educationService, type EduScheduleItem } from '@/services/educationService';

const STATUS_STYLES: Record<string, string> = {
  planned: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
};
const STATUS_LABELS: Record<string, string> = {
  planned: '예정', in_progress: '진행 중', completed: '완료', cancelled: '취소',
};

export default function SchedulePanel() {
  const [schedules, setSchedules] = useState<EduScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setSchedules(await educationService.getSchedules()); }
      catch (e) { console.error('일정 로드 실패:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">일정 로딩 중...</div>;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-3 py-2 font-medium text-gray-600">교육 제목</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">일시</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">장소</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">강사</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">참가자</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">상태</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2">
                  <div className="font-medium text-gray-900">{s.title}</div>
                  {s.notes && <div className="text-xs text-gray-400">{s.notes}</div>}
                </td>
                <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                  <div>{s.scheduledDate}</div>
                  {s.startTime && s.endTime && (
                    <div className="text-xs text-gray-400">{s.startTime} ~ {s.endTime}</div>
                  )}
                </td>
                <td className="px-3 py-2 text-gray-600">{s.location ?? '-'}</td>
                <td className="px-3 py-2 text-gray-600">{s.instructorName ?? '-'}</td>
                <td className="text-center px-3 py-2 text-gray-600">
                  {s.participantIds.length}{s.maxParticipants ? `/${s.maxParticipants}` : ''}명
                </td>
                <td className="text-center px-3 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[s.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {STATUS_LABELS[s.status] ?? s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {schedules.length === 0 && (
        <div className="text-center text-gray-400 py-12">등록된 교육 일정이 없습니다.</div>
      )}
    </div>
  );
}
