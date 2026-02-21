import { useEffect, useState } from 'react';
import { aiService, type RiskAssessmentResult, type HazardRecommendation, type Countermeasure } from '@/services/aiService';

const RISK_CONFIG: Record<string, { bg: string; text: string; label: string; color: string }> = {
  normal: { bg: 'bg-green-100', text: 'text-green-700', label: '정상', color: '#22C55E' },
  caution: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '주의', color: '#EAB308' },
  warning: { bg: 'bg-orange-100', text: 'text-orange-800', label: '경고', color: '#F97316' },
  danger: { bg: 'bg-red-100', text: 'text-red-700', label: '위험', color: '#EF4444' },
};

export default function DraPanel() {
  const [assessment, setAssessment] = useState<RiskAssessmentResult | null>(null);
  const [hazards, setHazards] = useState<HazardRecommendation[]>([]);
  const [countermeasures, setCountermeasures] = useState<Countermeasure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [a, h, c] = await Promise.all([
          aiService.getCurrentRiskAssessment(),
          aiService.getHazards(),
          aiService.getCountermeasures(),
        ]);
        setAssessment(a);
        setHazards(h);
        setCountermeasures(c);
      } catch (err) {
        console.error('DRA 데이터 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-48 text-gray-400">로딩 중...</div>;
  }

  const risk = RISK_CONFIG[assessment?.riskLevel ?? 'normal'] ?? RISK_CONFIG.normal;
  const score = assessment?.riskScore ?? 0;

  return (
    <div className="bg-white rounded-lg border p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">동적 위험성평가 (DRA)</h3>

      {/* 상단: 등급 게이지 + 정보 */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* 게이지 (반원형 시각화) */}
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-20 overflow-hidden">
            <svg viewBox="0 0 160 80" className="w-full h-full">
              {/* 배경 호 */}
              <path
                d="M 10 75 A 70 70 0 0 1 150 75"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* 값 호 */}
              <path
                d="M 10 75 A 70 70 0 0 1 150 75"
                fill="none"
                stroke={risk.color}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 220} 220`}
              />
            </svg>
          </div>
          <div className="text-center -mt-2">
            <span className="text-3xl font-bold text-gray-900">{score}</span>
            <span className="text-sm text-gray-400">/100</span>
          </div>
          <div className={`mt-1 px-3 py-1 rounded-full text-sm font-bold ${risk.bg} ${risk.text}`}>
            {risk.label}
          </div>
        </div>

        {/* 위험요인 */}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">위험요인 추천</h4>
          <div className="space-y-1.5">
            {hazards.map((h) => (
              <div key={h.code} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="text-gray-700">{h.name}</span>
                    <span className="text-gray-500">{h.score}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${h.score}%`,
                        backgroundColor: h.score >= 75 ? '#EF4444' : h.score >= 50 ? '#F97316' : '#EAB308',
                      }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">{h.source}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 감소대책 */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">감소대책</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {countermeasures.map((c) => (
            <div key={c.code} className="flex items-start gap-2 bg-blue-50 rounded-md p-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                {c.priority}
              </span>
              <p className="text-sm text-gray-700">{c.action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
