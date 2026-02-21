import { useState } from 'react';
import type { SmartVest } from '@/services/deviceService';
import { formatDateTime } from '@/utils/formatDate';

const MODULE_TYPE_LABELS: Record<string, string> = {
  open_field: '노지',
  livestock: '축산',
  orchard: '과수원',
};

const COMM_TYPE_LABELS: Record<string, string> = {
  ble: 'BLE',
  lora: 'LoRa',
  lte: 'LTE',
};

function getBatteryColor(level: number): string {
  if (level >= 85) return 'text-green-600';
  if (level >= 30) return 'text-yellow-500';
  return 'text-red-500';
}

function getCommStatusDot(status: string): string {
  if (status === 'online') return 'bg-green-400';
  if (status === 'error') return 'bg-red-400';
  return 'bg-gray-400';
}

interface Props {
  vests: SmartVest[];
  onEdit: (vest: SmartVest) => void;
  onDelete: (id: string) => void;
}

export default function SmartVestTable({ vests, onEdit, onDelete }: Props) {
  const [filter, setFilter] = useState('');

  const filtered = vests.filter(
    (v) =>
      v.serialNo.toLowerCase().includes(filter.toLowerCase()) ||
      v.farm?.name?.toLowerCase().includes(filter.toLowerCase()),
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">모듈 타입</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">농가</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">배정 작업자</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">배터리</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">통신</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">통신방식</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">마지막 수신</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">
                  등록된 스마트 조끼가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((vest) => (
                <tr key={vest.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">{vest.serialNo}</td>
                  <td className="px-4 py-3 text-sm">{MODULE_TYPE_LABELS[vest.moduleType] ?? vest.moduleType}</td>
                  <td className="px-4 py-3 text-sm">{vest.farm?.name ?? '-'}</td>
                  <td className="px-4 py-3 text-sm">{vest.workerId ? vest.workerId.slice(0, 8) + '...' : '미배정'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`font-semibold ${getBatteryColor(vest.batteryLevel)}`}>
                      {vest.batteryLevel}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${getCommStatusDot(vest.commStatus)}`} />
                      {vest.commStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{vest.commType ? COMM_TYPE_LABELS[vest.commType] : '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {vest.lastHeartbeat ? formatDateTime(vest.lastHeartbeat) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <button
                      onClick={() => onEdit(vest)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => onDelete(vest.id)}
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
