import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import { deviceService, type Sensor, type SensorDataPoint } from '@/services/deviceService';

interface Props {
  sensor: Sensor;
  onClose: () => void;
}

export default function SensorDataChart({ sensor, onClose }: Props) {
  const [data, setData] = useState<SensorDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const now = new Date();
    const from = new Date(now);
    switch (range) {
      case '1h': from.setHours(from.getHours() - 1); break;
      case '6h': from.setHours(from.getHours() - 6); break;
      case '24h': from.setDate(from.getDate() - 1); break;
      case '7d': from.setDate(from.getDate() - 7); break;
    }
    try {
      const result = await deviceService.getSensorData(sensor.id, from.toISOString(), now.toISOString());
      setData(result);
    } catch (err) {
      console.error('센서 데이터 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [sensor.id, range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartData = data.map((d) => ({
    time: new Date(d.time).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    value: d.value,
  }));

  const threshold = sensor.thresholdConfig;

  // Y축 범위 계산
  const values = data.map((d) => d.value);
  const allValues = [...values];
  if (threshold) {
    allValues.push(threshold.caution, threshold.warning, threshold.danger);
  }
  const yMin = allValues.length > 0 ? Math.floor(Math.min(...allValues) * 0.9) : 0;
  const yMax = allValues.length > 0 ? Math.ceil(Math.max(...allValues) * 1.1) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">센서 데이터 - {sensor.serialNo}</h2>
            <p className="text-sm text-gray-500">{sensor.workplace?.name ?? '작업장'}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            &times;
          </button>
        </div>

        <div className="px-6 py-4">
          {/* 시간 범위 선택 */}
          <div className="flex gap-2 mb-4">
            {(['1h', '6h', '24h', '7d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 text-sm rounded-md ${
                  range === r
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {r === '1h' ? '1시간' : r === '6h' ? '6시간' : r === '24h' ? '24시간' : '7일'}
              </button>
            ))}
          </div>

          {/* 차트 */}
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              데이터를 불러오는 중...
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              해당 기간 데이터가 없습니다.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis domain={[yMin, yMax]} tick={{ fontSize: 12 }} />
                <Tooltip />

                {/* 임계값 구간 배경색 */}
                {threshold && (
                  <>
                    <ReferenceArea
                      y1={threshold.caution}
                      y2={threshold.warning}
                      fill="#EAB308"
                      fillOpacity={0.1}
                    />
                    <ReferenceArea
                      y1={threshold.warning}
                      y2={threshold.danger}
                      fill="#F97316"
                      fillOpacity={0.1}
                    />
                    <ReferenceArea
                      y1={threshold.danger}
                      y2={yMax}
                      fill="#EF4444"
                      fillOpacity={0.1}
                    />
                  </>
                )}

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* 임계값 범례 */}
          {threshold && (
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-yellow-200" /> 주의: {threshold.caution}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-orange-200" /> 경고: {threshold.warning}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-red-200" /> 위험: {threshold.danger}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
