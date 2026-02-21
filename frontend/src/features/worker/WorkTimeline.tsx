import { useEffect, useState } from 'react';
import { workerService, type TimelineEvent } from '@/services/workerService';

const TYPE_CONFIG: Record<string, { color: string; bgColor: string; label: string }> = {
  work: { color: 'bg-blue-500', bgColor: 'bg-blue-50', label: '작업' },
  rest: { color: 'bg-green-500', bgColor: 'bg-green-50', label: '휴식' },
  danger_event: { color: 'bg-red-500', bgColor: 'bg-red-50', label: '위험' },
};

function formatHHMM(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function durationLabel(start: string, end: string | null): string {
  if (!end) return '진행 중';
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes}분`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}시간 ${m}분`;
}

interface Props {
  workerId: string;
}

export default function WorkTimeline({ workerId }: Props) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      setLoading(true);
      try {
        const data = await workerService.getTimeline(workerId);
        setEvents(data);
      } catch (err) {
        console.error('타임라인 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [workerId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">작업 이력 타임라인</h3>
        <div className="flex items-center justify-center h-48 text-gray-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">작업 이력 타임라인</h3>

      {events.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">오늘의 활동 이력이 없습니다.</p>
      ) : (
        <div className="space-y-0">
          {events.map((event, idx) => {
            const config = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.work;
            return (
              <div key={idx} className="flex items-start gap-3 relative">
                {/* 세로선 */}
                {idx < events.length - 1 && (
                  <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-gray-200" />
                )}
                {/* 점 */}
                <div className={`mt-1.5 w-3 h-3 rounded-full shrink-0 ring-2 ring-white ${config.color}`} />
                {/* 내용 */}
                <div className={`flex-1 rounded-md p-3 mb-2 ${config.bgColor}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{event.label}</span>
                    <span className="text-xs text-gray-500">
                      {formatHHMM(event.time)}
                      {event.endTime && ` ~ ${formatHHMM(event.endTime)}`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {durationLabel(event.time, event.endTime)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
