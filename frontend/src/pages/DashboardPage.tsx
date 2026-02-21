import { useEffect, useState, useCallback } from 'react';
import {
  dashboardService,
  type DashboardOverview,
  type MapData,
} from '@/services/dashboardService';
import {
  useDashboardSocket,
  type SensorUpdate,
  type WorkerStatusUpdate,
  type AlertNew,
} from '@/hooks/useDashboardSocket';

import RiskSummaryCards from '@/features/dashboard/RiskSummaryCards';
import SensorPanel from '@/features/dashboard/SensorPanel';
import WorkerStatusList, {
  type WorkerStatusItem,
} from '@/features/dashboard/WorkerStatusList';
import AlertTimeline, {
  type AlertTimelineItem,
} from '@/features/dashboard/AlertTimeline';
import DashboardMap from '@/features/dashboard/DashboardMap';
import type { RiskLevel } from '@/types';

export default function DashboardPage() {
  // ── 상태 ──
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [sensorData, setSensorData] = useState<SensorUpdate[]>([]);
  const [workers, setWorkers] = useState<WorkerStatusItem[]>([]);
  const [alerts, setAlerts] = useState<AlertTimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ── 데이터 로드 ──
  const fetchData = useCallback(async (farmId?: string) => {
    try {
      setLoading(true);
      const [ov, md] = await Promise.all([
        dashboardService.getOverview(farmId),
        dashboardService.getMapData(farmId),
      ]);
      setOverview(ov);
      setMapData(md);

      const workerItems: WorkerStatusItem[] = (md.workers || []).map((w) => ({
        workerId: w.id,
        name: w.name,
        status: (w.status as WorkerStatusItem['status']) || 'offline',
        riskLevel: (w.riskLevel as RiskLevel) || 'normal',
        heartRate: w.metadata?.heartRate as number | undefined,
        bodyTemp: w.metadata?.bodyTemp as number | undefined,
      }));
      setWorkers(workerItems);
    } catch (err) {
      console.error('대시보드 데이터 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(selectedFarmId || undefined);
  }, [selectedFarmId, fetchData]);

  // ── WebSocket 실시간 업데이트 ──
  const handleSensorUpdate = useCallback((data: SensorUpdate) => {
    setSensorData((prev) => {
      const filtered = prev.filter((s) => s.sensorId !== data.sensorId);
      return [data, ...filtered];
    });
  }, []);

  const handleWorkerStatus = useCallback((data: WorkerStatusUpdate) => {
    setWorkers((prev) =>
      prev.map((w) =>
        w.workerId === data.workerId
          ? {
              ...w,
              name: data.name || w.name,
              status: (data.status as WorkerStatusItem['status']) || w.status,
              heartRate: data.heartRate ?? w.heartRate,
              bodyTemp: data.bodyTemp ?? w.bodyTemp,
            }
          : w,
      ),
    );
  }, []);

  const handleAlertNew = useCallback((data: AlertNew) => {
    const item: AlertTimelineItem = {
      alertId: data.alertId,
      type: data.type,
      severity: data.severity as AlertTimelineItem['severity'],
      message: data.message,
      workerName: data.workerName,
      timestamp: data.timestamp,
    };
    setAlerts((prev) => [item, ...prev].slice(0, 50));
  }, []);

  const { isConnected } = useDashboardSocket(selectedFarmId, {
    onSensorUpdate: handleSensorUpdate,
    onWorkerStatus: handleWorkerStatus,
    onAlertNew: handleAlertNew,
  });

  // ── 농장 목록 (지도 데이터에서 추출) ──
  const farms = mapData?.farms || [];

  return (
    <main className="flex-1 flex flex-col bg-gray-100">
      {/* 페이지 헤더 바 */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-gray-900">농작업 안전관리 대시보드</h1>
          <select
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedFarmId || ''}
            onChange={(e) => setSelectedFarmId(e.target.value || null)}
          >
            <option value="">전체 농장</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
        <span
          className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
          title={isConnected ? '실시간 연결됨' : '연결 끊김'}
        />
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">데이터를 불러오는 중...</div>
          </div>
        ) : (
          <>
            <RiskSummaryCards data={overview?.riskSummary ?? null} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: '450px' }}>
              <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
                <DashboardMap mapData={mapData} />
              </div>
              <div className="space-y-4 overflow-y-auto">
                <div className="bg-white rounded-lg shadow p-4">
                  <SensorPanel latestSensorData={sensorData} />
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <WorkerStatusList workers={workers} />
                </div>
                {overview?.deviceSummary && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">장비 현황</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">스마트조끼</p>
                        <p className="font-bold">
                          <span className="text-green-600">{overview.deviceSummary.vestsOnline}</span>
                          <span className="text-gray-400">/{overview.deviceSummary.vestsTotal}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">환경센서</p>
                        <p className="font-bold">
                          <span className="text-green-600">{overview.deviceSummary.sensorsOnline}</span>
                          <span className="text-gray-400">/{overview.deviceSummary.sensorsTotal}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <AlertTimeline alerts={alerts} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
