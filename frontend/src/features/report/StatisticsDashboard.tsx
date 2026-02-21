import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';
import { reportService, type StatisticsData } from '@/services/reportService';

const PIE_COLORS = ['#3B82F6', '#F97316', '#EAB308', '#22C55E', '#8B5CF6', '#EF4444', '#6B7280'];

const HEATMAP_COLORS = ['#f0fdf4', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d'];

function getHeatmapColor(count: number): string {
  if (count === 0) return HEATMAP_COLORS[0];
  if (count <= 1) return HEATMAP_COLORS[1];
  if (count <= 2) return HEATMAP_COLORS[2];
  if (count <= 3) return HEATMAP_COLORS[3];
  if (count <= 4) return HEATMAP_COLORS[4];
  if (count <= 5) return HEATMAP_COLORS[5];
  return HEATMAP_COLORS[6];
}

export default function StatisticsDashboard() {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const stats = await reportService.getStatistics();
        setData(stats);
      } catch (err) {
        console.error('통계 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !data) {
    return <div className="flex items-center justify-center h-96 text-gray-400">통계 데이터 로딩 중...</div>;
  }

  // 히트맵 데이터를 요일별로 그룹
  const heatmapByDay = new Map<string, typeof data.hourlyHeatmap>();
  data.hourlyHeatmap.forEach((h) => {
    const list = heatmapByDay.get(h.dayLabel) ?? [];
    list.push(h);
    heatmapByDay.set(h.dayLabel, list);
  });
  const hours = Array.from(new Set(data.hourlyHeatmap.map((h) => h.hour))).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {/* 상단: 월별 추이 + 유형별 분포 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 월별 사고 추이 */}
        <div className="bg-white rounded-lg border p-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">사고 발생 추이 (월별)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="accidents" stroke="#EF4444" strokeWidth={2} name="사고" dot />
              <Line type="monotone" dataKey="nearMisses" stroke="#F97316" strokeWidth={2} strokeDasharray="5 5" name="아차사고" dot />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 사고유형별 분포 (도넛) */}
        <div className="bg-white rounded-lg border p-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">사고유형별 분포</h4>
          <div className="flex items-center">
            <ResponsiveContainer width="60%" height={250}>
              <PieChart>
                <Pie
                  data={data.typeDistribution}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {data.typeDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [`${value}건`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {data.typeDistribution.map((d, i) => (
                <div key={d.type} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-gray-700">{d.label}</span>
                  <span className="text-gray-400 ml-auto">{d.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 중단: 히트맵 + 농장별 알림 빈도 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 시간대별 히트맵 */}
        <div className="bg-white rounded-lg border p-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">시간대별 사고 분포</h4>
          <div className="overflow-x-auto">
            <table className="text-xs">
              <thead>
                <tr>
                  <th className="px-1 py-1 text-gray-500 font-normal" />
                  {hours.map((h) => (
                    <th key={h} className="px-1 py-1 text-gray-500 font-normal text-center">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['월', '화', '수', '목', '금', '토', '일'].map((dayLabel) => (
                  <tr key={dayLabel}>
                    <td className="px-1 py-1 text-gray-500 text-right pr-2">{dayLabel}</td>
                    {hours.map((hour) => {
                      const cell = (heatmapByDay.get(dayLabel) ?? []).find((h) => h.hour === hour);
                      const count = cell?.count ?? 0;
                      return (
                        <td key={hour} className="px-0.5 py-0.5">
                          <div
                            className="w-6 h-6 rounded-sm"
                            style={{ backgroundColor: getHeatmapColor(count) }}
                            title={`${dayLabel} ${hour}시: ${count}건`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
              <span>적음</span>
              {HEATMAP_COLORS.map((c, i) => (
                <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
              ))}
              <span>많음</span>
            </div>
          </div>
        </div>

        {/* 농장별 위험 알림 빈도 */}
        <div className="bg-white rounded-lg border p-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">농장별 위험 알림 빈도</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.farmAlertFrequency} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="farmName" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(value: number) => [`${value}건`, '알림']} />
              <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 하단: 오경보율 추이 */}
      <div className="bg-white rounded-lg border p-5">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">오경보율 추이 (월별)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.falseAlarmTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} unit="%" />
            <Tooltip formatter={(value: number, name: string) => [name === 'rate' ? `${value}%` : value, name === 'rate' ? '오경보율' : name]} />
            <Legend />
            <Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={2} name="오경보율 (%)" dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
