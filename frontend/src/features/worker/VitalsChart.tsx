import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { workerService, type VitalDataPoint } from '@/services/workerService';

interface Props {
  workerId: string;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function VitalsChart({ workerId }: Props) {
  const [data, setData] = useState<VitalDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVitals = async () => {
      setLoading(true);
      try {
        const vitals = await workerService.getVitals(workerId);
        setData(vitals);
      } catch (err) {
        console.error('생체신호 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVitals();
  }, [workerId]);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">로딩 중...</div>;
  }

  const chartData = data.map((d) => ({
    time: formatTime(d.time),
    heartRate: d.heartRate,
    bodyTemp: d.bodyTemp,
  }));

  return (
    <div className="bg-white rounded-lg border p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">생체신호 추이</h3>

      {/* 심박수 차트 */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">심박수 (bpm)</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis domain={[40, 140]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <ReferenceLine y={100} stroke="#EF4444" strokeDasharray="5 5" label={{ value: '임계 100bpm', position: 'right', fontSize: 10, fill: '#EF4444' }} />
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              name="심박수"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 체온 차트 */}
      <div>
        <p className="text-sm text-gray-600 mb-2">체온 (&deg;C)</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis domain={[35.5, 39.5]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <ReferenceLine y={38} stroke="#EF4444" strokeDasharray="5 5" label={{ value: '임계 38℃', position: 'right', fontSize: 10, fill: '#EF4444' }} />
            <Line
              type="monotone"
              dataKey="bodyTemp"
              stroke="#F97316"
              strokeWidth={2}
              dot={false}
              name="체온"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
