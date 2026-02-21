import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import type { SensorUpdate } from '@/hooks/useDashboardSocket';

interface SensorGaugeProps {
  label: string;
  value: number;
  unit: string;
  max: number;
  color: string;
}

function SensorGauge({ label, value, unit, max, color }: SensorGaugeProps) {
  const pct = Math.min((value / max) * 100, 100);
  const data = [{ value: pct, fill: color }];

  return (
    <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="w-20 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
            data={data}
          >
            <RadialBar dataKey="value" cornerRadius={4} background={{ fill: '#f3f4f6' }} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-lg font-bold -mt-2">
        {value.toFixed(1)}
        <span className="text-xs text-gray-400 ml-0.5">{unit}</span>
      </p>
    </div>
  );
}

interface Props {
  latestSensorData: SensorUpdate[];
}

export default function SensorPanel({ latestSensorData }: Props) {
  // 센서 타입별 최신 데이터에서 대표값 추출
  const getLatest = (type: string) => {
    const found = latestSensorData.find((s) => s.type === type);
    return found?.value ?? 0;
  };

  const gauges = [
    { label: '온도', value: getLatest('temperature'), unit: '℃', max: 50, color: '#EF4444' },
    { label: '습도', value: getLatest('humidity'), unit: '%', max: 100, color: '#3B82F6' },
    { label: 'WBGT', value: getLatest('wbgt'), unit: '℃', max: 40, color: '#F97316' },
    { label: 'O₂', value: getLatest('gas_o2') || 20.9, unit: '%', max: 25, color: '#22C55E' },
    { label: 'H₂S', value: getLatest('gas_h2s'), unit: 'ppm', max: 50, color: '#A855F7' },
    { label: '전류', value: getLatest('current'), unit: 'A', max: 100, color: '#EAB308' },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">센서 상태</h3>
      <div className="grid grid-cols-3 gap-2">
        {gauges.map((g) => (
          <SensorGauge key={g.label} {...g} />
        ))}
      </div>
    </div>
  );
}
