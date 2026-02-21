import { useState } from 'react';
import type { EmergencyKit } from '@/services/deviceService';
import { formatDateTime } from '@/utils/formatDate';

const KIT_TYPE_LABELS: Record<string, string> = {
  wall_mounted: '벽부착형',
  vehicle_mounted: '차량탑재형',
};

const KIT_STATUS_LABELS: Record<string, string> = {
  normal: '정상',
  opened: '개봉됨',
  alarm: '알람',
  maintenance: '점검중',
};

function getStatusColor(status: string): string {
  switch (status) {
    case 'normal': return 'bg-green-100 text-green-800';
    case 'opened': return 'bg-yellow-100 text-yellow-800';
    case 'alarm': return 'bg-red-100 text-red-800';
    case 'maintenance': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getBatteryColor(level: number | null): string {
  if (level === null) return 'text-gray-400';
  if (level >= 85) return 'text-green-600';
  if (level >= 30) return 'text-yellow-500';
  return 'text-red-500';
}

interface Props {
  kits: EmergencyKit[];
  onEdit: (kit: EmergencyKit) => void;
  onDelete: (id: string) => void;
}

export default function EmergencyKitTable({ kits, onEdit, onDelete }: Props) {
  const [filter, setFilter] = useState('');

  const filtered = kits.filter(
    (k) =>
      k.serialNo.toLowerCase().includes(filter.toLowerCase()) ||
      k.farm?.name?.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="시리얼 번호 또는 농가명 검색..."
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">타입</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">농가</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업장</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">배터리</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">마지막 수신</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                  등록된 응급키트가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((kit) => (
                <tr key={kit.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">{kit.serialNo}</td>
                  <td className="px-4 py-3 text-sm">{KIT_TYPE_LABELS[kit.type] ?? kit.type}</td>
                  <td className="px-4 py-3 text-sm">{kit.farm?.name ?? '-'}</td>
                  <td className="px-4 py-3 text-sm">{kit.workplace?.name ?? kit.vehicleId ?? '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`font-semibold ${getBatteryColor(kit.batteryLevel)}`}>
                      {kit.batteryLevel !== null ? `${kit.batteryLevel}%` : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(kit.status)}`}>
                      {KIT_STATUS_LABELS[kit.status] ?? kit.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {kit.lastHeartbeat ? formatDateTime(kit.lastHeartbeat) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <button
                      onClick={() => onEdit(kit)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => onDelete(kit.id)}
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
