import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { educationService, type AchievementAnalysis } from '@/services/educationService';

const SEVERITY_STYLES: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-blue-100 text-blue-700',
};
const SEVERITY_LABELS: Record<string, string> = { high: '높음', medium: '중간', low: '낮음' };

export default function AnalysisPanel() {
  const [workerId, setWorkerId] = useState('');
  const [data, setData] = useState<AchievementAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!workerId.trim()) return;
    setLoading(true);
    try { setData(await educationService.getAnalysis(workerId)); }
    catch (e) { console.error('분석 로드 실패:', e); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      {/* 검색 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={workerId}
          onChange={(e) => setWorkerId(e.target.value)}
          placeholder="작업자 ID (UUID)"
          className="flex-1 border rounded-md px-3 py-2 text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
          분석 조회
        </button>
      </div>

      {loading && <div className="text-center py-12 text-gray-400">분석 중...</div>}

      {!loading && data && (
        <div className="space-y-6">
          {/* 요약 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">작업자</div>
              <div className="text-lg font-semibold text-gray-900">{data.workerName}</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">종합 점수</div>
              <div className={`text-2xl font-bold ${data.overallScore >= 80 ? 'text-green-600' : data.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {data.overallScore}점
              </div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">취약점 수</div>
              <div className="text-2xl font-bold text-orange-600">{data.weaknesses.length}개</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 취약점 분석 */}
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">AI 취약점 진단</h4>
              <div className="space-y-2">
                {data.weaknesses.map((w, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${SEVERITY_STYLES[w.severity] ?? ''}`}>
                      {SEVERITY_LABELS[w.severity] ?? w.severity}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{w.label}</div>
                      <div className="text-xs text-gray-500">{w.description}</div>
                    </div>
                  </div>
                ))}
                {data.weaknesses.length === 0 && <div className="text-sm text-gray-400">취약점 없음</div>}
              </div>
            </div>

            {/* 재훈련 추천 */}
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">재훈련 미션 추천</h4>
              <div className="space-y-2">
                {data.recommendedMissions.map((m, i) => (
                  <div key={i} className="p-2 bg-blue-50 rounded">
                    <div className="text-sm font-medium text-blue-900">{m.contentTitle}</div>
                    <div className="text-xs text-blue-600">{m.reason}</div>
                  </div>
                ))}
                {data.recommendedMissions.length === 0 && <div className="text-sm text-gray-400">추천 미션 없음</div>}
              </div>
            </div>
          </div>

          {/* 교육 이력 차트 */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">교육 이력 (점수 추이)</h4>
            {data.trainingHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[...data.trainingHistory].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`${v}점`, '점수']} labelFormatter={(l) => `교육일: ${l}`} />
                  <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-400 py-8">교육 이력 없음</div>
            )}
          </div>
        </div>
      )}

      {!loading && !data && (
        <div className="text-center text-gray-400 py-16">작업자 ID를 입력하고 분석 조회를 클릭하세요.</div>
      )}
    </div>
  );
}
