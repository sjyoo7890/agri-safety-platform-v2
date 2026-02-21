import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { aiService, type XaiResult, type RealtimePrediction } from '@/services/aiService';

const BAR_COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D1D5DB'];

interface Props {
  selectedPrediction: RealtimePrediction | null;
}

export default function XaiPanel({ selectedPrediction }: Props) {
  const [xai, setXai] = useState<XaiResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedPrediction?.latestId) {
      setXai(null);
      return;
    }
    const fetchXai = async () => {
      setLoading(true);
      try {
        const data = await aiService.getXaiResult(selectedPrediction.latestId!);
        setXai(data);
      } catch (err) {
        console.error('XAI 결과 로드 실패:', err);
        setXai(null);
      } finally {
        setLoading(false);
      }
    };
    fetchXai();
  }, [selectedPrediction]);

  // 선택된 예측이 없거나 latestId가 없을 때 시뮬레이션 표시
  const factors = xai?.xaiFactors ?? [
    { feature: '합성 가속도', contribution: 42 },
    { feature: '자세 변화각', contribution: 28 },
    { feature: '고도 변화', contribution: 15 },
    { feature: '작업 시간', contribution: 10 },
    { feature: '기타', contribution: 5 },
  ];

  const llmMessage = xai?.llmMessage ??
    (selectedPrediction
      ? `${selectedPrediction.label} 위험도가 ${selectedPrediction.prediction}점으로 측정되었습니다. 주요 기여 요인을 확인하고 적절한 안전 조치를 취해주세요.`
      : '좌측 사고유형 카드를 클릭하면 XAI 분석 결과를 확인할 수 있습니다.');

  return (
    <div className="bg-white rounded-lg border p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-2">
        XAI 기여요인 분석
        {selectedPrediction && (
          <span className="text-sm font-normal text-gray-500 ml-2">
            - {selectedPrediction.label}
          </span>
        )}
      </h3>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">로딩 중...</div>
      ) : (
        <>
          {/* 수평 BarChart */}
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={factors} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <YAxis type="category" dataKey="feature" tick={{ fontSize: 11 }} width={90} />
              <Tooltip formatter={(value: number) => [`${value}%`, '기여도']} />
              <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                {factors.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* LLM 자연어 메시지 */}
          <div className="mt-4 bg-blue-50 rounded-lg p-4">
            <p className="text-xs font-medium text-blue-600 mb-1">AI 분석 메시지</p>
            <p className="text-sm text-gray-700 leading-relaxed">{llmMessage}</p>
          </div>
        </>
      )}
    </div>
  );
}
