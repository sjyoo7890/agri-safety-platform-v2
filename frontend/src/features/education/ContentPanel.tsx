import { useEffect, useState } from 'react';
import { educationService, type EduContentItem } from '@/services/educationService';

const ACCIDENT_LABELS: Record<string, string> = {
  FALL: '추락/넘어짐', ENTANGLE: '끼임/감김', HEAT: '온열질환/질식',
  FIRE: '전기화재', ROLLOVER: '차량 전도/전복', COLLISION: '농기계-작업자 충돌',
};
const TYPE_LABELS: Record<string, string> = {
  vr_content: 'VR 콘텐츠', kit_training: '키트 실습', classroom: '교실 교육',
};
const SIM_LABELS: Record<string, string> = { six_axis: '6축 탑승형', treadmill: '트레드밀형' };
const DIFF_LABELS: Record<string, string> = { beginner: '초급', intermediate: '중급', advanced: '고급' };
const STATUS_STYLES: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  archived: 'bg-yellow-100 text-yellow-700',
};
const STATUS_LABELS: Record<string, string> = { published: '배포', draft: '초안', archived: '보관' };

export default function ContentPanel() {
  const [contents, setContents] = useState<EduContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setContents(await educationService.getContents()); }
      catch (e) { console.error('콘텐츠 로드 실패:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">콘텐츠 로딩 중...</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contents.map((c) => (
          <div key={c.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-900 leading-snug">{c.title}</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {STATUS_LABELS[c.status] ?? c.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{c.description}</p>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>사고유형</span>
                <span className="font-medium">{ACCIDENT_LABELS[c.accidentType] ?? c.accidentType}</span>
              </div>
              <div className="flex justify-between">
                <span>콘텐츠 유형</span>
                <span className="font-medium">{TYPE_LABELS[c.type] ?? c.type}</span>
              </div>
              {c.simulatorType && (
                <div className="flex justify-between">
                  <span>시뮬레이터</span>
                  <span className="font-medium">{SIM_LABELS[c.simulatorType] ?? c.simulatorType}</span>
                </div>
              )}
              {c.difficulty && (
                <div className="flex justify-between">
                  <span>난이도</span>
                  <span className="font-medium">{DIFF_LABELS[c.difficulty] ?? c.difficulty}</span>
                </div>
              )}
              {c.durationMin && (
                <div className="flex justify-between">
                  <span>소요시간</span>
                  <span className="font-medium">{c.durationMin}분</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>버전</span>
                <span className="font-medium">{c.version}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {contents.length === 0 && (
        <div className="text-center text-gray-400 py-12">등록된 콘텐츠가 없습니다.</div>
      )}
    </div>
  );
}
