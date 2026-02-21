import { useEffect, useState } from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { aiService, type RealtimePrediction } from '@/services/aiService';

interface Props {
  onSelectPrediction?: (pred: RealtimePrediction) => void;
}

export default function PredictionRadarChart({ onSelectPrediction }: Props) {
  const [predictions, setPredictions] = useState<RealtimePrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await aiService.getRealtimePredictions();
        setPredictions(data);
      } catch (err) {
        console.error('예측 데이터 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-80 text-gray-400">로딩 중...</div>;
  }

  const chartData = predictions.map((p) => ({
    type: p.label,
    score: p.prediction,
    fullMark: 100,
  }));

  return (
    <div className="bg-white rounded-lg border p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-2">6대 사고유형 위험도</h3>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="type" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Tooltip formatter={(value: number) => [`${value}점`, '위험도']} />
          <Radar
            name="위험도"
            dataKey="score"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* 카드 목록 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
        {predictions.map((p) => {
          const color =
            p.prediction >= 76 ? 'border-red-300 bg-red-50' :
            p.prediction >= 51 ? 'border-orange-300 bg-orange-50' :
            p.prediction >= 26 ? 'border-yellow-300 bg-yellow-50' :
            'border-green-300 bg-green-50';
          return (
            <button
              key={p.modelType}
              onClick={() => onSelectPrediction?.(p)}
              className={`border rounded-md p-2.5 text-left hover:shadow-sm transition-shadow ${color}`}
            >
              <p className="text-xs text-gray-500">{p.label}</p>
              <p className="text-lg font-bold text-gray-900">{p.prediction}</p>
              <p className="text-xs text-gray-400">신뢰도 {(p.confidence * 100).toFixed(1)}%</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
