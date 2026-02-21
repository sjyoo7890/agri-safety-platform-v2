import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { workerService, type AcclimatizationAnalysis } from '@/services/workerService';

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  A: { bg: 'bg-green-100', text: 'text-green-700' },
  B: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  C: { bg: 'bg-red-100', text: 'text-red-700' },
};

interface Props {
  workerId: string;
}

export default function AcclimatizationPanel({ workerId }: Props) {
  const [analysis, setAnalysis] = useState<AcclimatizationAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await workerService.getAcclimatization(workerId);
        setAnalysis(data);
      } catch (err) {
        console.error('열 순응도 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [workerId]);

  if (loading || !analysis) {
    return (
      <div className="bg-white rounded-lg border p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">열 순응도 분석</h3>
        <div className="flex items-center justify-center h-32 text-gray-400">로딩 중...</div>
      </div>
    );
  }

  const levelColor = LEVEL_COLORS[analysis.level] ?? LEVEL_COLORS.C;
  const chartData = analysis.dailyExposure.map((d) => ({
    date: d.date.slice(5), // MM-DD
    hours: d.hours,
  }));

  return (
    <div className="bg-white rounded-lg border p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">열 순응도 분석</h3>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className={`rounded-md p-3 text-center ${levelColor.bg}`}>
          <p className="text-xs text-gray-500 mb-1">등급</p>
          <p className={`text-lg font-bold ${levelColor.text}`}>{analysis.level}</p>
          <p className="text-xs text-gray-500">{analysis.levelLabel}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">14일 누적 노출</p>
          <p className="text-lg font-bold text-gray-900">{analysis.heatExposureHours14d}시간</p>
        </div>
        <div className="bg-gray-50 rounded-md p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">권장 연속작업</p>
          <p className="text-lg font-bold text-blue-600">{analysis.recommendedWorkMinutes}분</p>
        </div>
        <div className="bg-gray-50 rounded-md p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">권장 휴식</p>
          <p className="text-lg font-bold text-green-600">{analysis.recommendedRestMinutes}분 이상</p>
        </div>
      </div>

      {/* 14일 노출 차트 */}
      <p className="text-sm text-gray-600 mb-2">최근 14일 고온 노출 시간</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} unit="h" />
          <Tooltip formatter={(value: number) => [`${value}시간`, '노출 시간']} />
          <Bar dataKey="hours" fill="#F97316" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
