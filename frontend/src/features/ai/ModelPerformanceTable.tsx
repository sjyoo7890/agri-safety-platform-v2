import { useEffect, useState } from 'react';
import { aiService, type ModelPerformance } from '@/services/aiService';

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  normal: { bg: 'bg-green-100', text: 'text-green-700', label: '정상' },
  caution: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '주의' },
  danger: { bg: 'bg-red-100', text: 'text-red-700', label: '이상' },
};

export default function ModelPerformanceTable() {
  const [models, setModels] = useState<ModelPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await aiService.getModelPerformance();
        setModels(data);
      } catch (err) {
        console.error('모델 성능 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-32 text-gray-400">로딩 중...</div>;
  }

  return (
    <div className="bg-white rounded-lg border p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">모델 성능 모니터링</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-2.5 border-b font-medium text-gray-600">모델</th>
              <th className="text-center px-4 py-2.5 border-b font-medium text-gray-600">Accuracy</th>
              <th className="text-center px-4 py-2.5 border-b font-medium text-gray-600">AUROC</th>
              <th className="text-center px-4 py-2.5 border-b font-medium text-gray-600">오경보율</th>
              <th className="text-center px-4 py-2.5 border-b font-medium text-gray-600">예측 수</th>
              <th className="text-center px-4 py-2.5 border-b font-medium text-gray-600">상태</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => {
              const status = STATUS_CONFIG[m.status] ?? STATUS_CONFIG.normal;
              return (
                <tr key={m.modelType} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 border-b font-medium text-gray-900">{m.label}</td>
                  <td className="text-center px-4 py-2.5 border-b">
                    <span className={m.accuracy < 0.95 ? 'text-red-600 font-bold' : 'text-gray-700'}>
                      {(m.accuracy * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-center px-4 py-2.5 border-b text-gray-700">
                    {m.auroc.toFixed(3)}
                  </td>
                  <td className="text-center px-4 py-2.5 border-b">
                    <span className={m.falseAlarmRate > 5 ? 'text-orange-600 font-medium' : 'text-gray-700'}>
                      {m.falseAlarmRate}%
                    </span>
                  </td>
                  <td className="text-center px-4 py-2.5 border-b text-gray-500">
                    {m.totalPredictions.toLocaleString()}
                  </td>
                  <td className="text-center px-4 py-2.5 border-b">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
