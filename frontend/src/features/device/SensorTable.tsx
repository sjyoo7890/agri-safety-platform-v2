import { useState } from 'react';
import type { Sensor } from '@/services/deviceService';
import { formatDateTime } from '@/utils/formatDate';

const SENSOR_TYPE_LABELS: Record<string, string> = {
  temperature: '온도',
  humidity: '습도',
  gas_o2: '산소(O2)',
  gas_h2s: '황화수소(H2S)',
  gas_nh3: '암모니아(NH3)',
  gas_ch4: '메탄(CH4)',
  current: '전류',
  voltage: '전압',
  wbgt: 'WBGT',
};

function getStatusDot(status: string): string {
  switch (status) {
    case 'online': return 'bg-green-400';
    case 'error': return 'bg-red-400';
    case 'calibrating': return 'bg-yellow-400';
    default: return 'bg-gray-400';
  }
}

const STATUS_LABELS: Record<string, string> = {
  online: '온라인',
  offline: '오프라인',
  error: '오류',
  calibrating: '보정중',
};

interface Props {
  sensors: Sensor[];
  onEdit: (sensor: Sensor) => void;
  onDelete: (id: string) => void;
  onViewData: (sensor: Sensor) => void;
}

export default function SensorTable({ sensors, onEdit, onDelete, onViewData }: Props) {
  const [filter, setFilter] = useState('');

  const filtered = sensors.filter(
    (s) =>
      s.serialNo.toLowerCase().includes(filter.toLowerCase()) ||
      s.workplace?.name?.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="시리얼 번호 또는 작업장명 검색..."
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">시리얼 번호</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">센서 타입</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업장</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">임계값</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">마지막 수신</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                  등록된 환경센서가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((sensor) => (
                <tr key={sensor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">{sensor.serialNo}</td>
                  <td className="px-4 py-3 text-sm">{SENSOR_TYPE_LABELS[sensor.type] ?? sensor.type}</td>
                  <td className="px-4 py-3 text-sm">{sensor.workplace?.name ?? '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${getStatusDot(sensor.status)}`} />
                      {STATUS_LABELS[sensor.status] ?? sensor.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {sensor.thresholdConfig
                      ? `${sensor.thresholdConfig.caution} / ${sensor.thresholdConfig.warning} / ${sensor.thresholdConfig.danger}`
                      : '미설정'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {sensor.lastHeartbeat ? formatDateTime(sensor.lastHeartbeat) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <button
                      onClick={() => onViewData(sensor)}
                      className="text-green-600 hover:text-green-800 text-xs"
                    >
                      데이터
                    </button>
                    <button
                      onClick={() => onEdit(sensor)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => onDelete(sensor.id)}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
