import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface SensorUpdate {
  sensorId: string;
  type: string;
  value: number;
  unit: string;
  timestamp: string;
}

export interface WorkerStatusUpdate {
  workerId: string;
  name: string;
  status: string;
  heartRate?: number;
  bodyTemp?: number;
  lat?: number;
  lng?: number;
}

export interface AlertNew {
  alertId: string;
  type: string;
  severity: string;
  message: string;
  workerName?: string;
  timestamp: string;
  farmId?: string;
}

export interface RiskChange {
  workplaceId: string;
  previousLevel: string;
  currentLevel: string;
  riskScore: number;
}

interface DashboardSocketHandlers {
  onSensorUpdate?: (data: SensorUpdate) => void;
  onWorkerStatus?: (data: WorkerStatusUpdate) => void;
  onAlertNew?: (data: AlertNew) => void;
  onRiskChange?: (data: RiskChange) => void;
}

export function useDashboardSocket(
  farmId: string | null,
  handlers: DashboardSocketHandlers,
) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
    const socket = io(`${wsUrl}/ws/dashboard`, {
      transports: ['websocket'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      if (farmId) {
        socket.emit('join_farm', farmId);
      }
    });

    socket.on('disconnect', () => setIsConnected(false));

    socket.on('sensor_update', (data: SensorUpdate) => {
      handlers.onSensorUpdate?.(data);
    });

    socket.on('worker_status', (data: WorkerStatusUpdate) => {
      handlers.onWorkerStatus?.(data);
    });

    socket.on('alert_new', (data: AlertNew) => {
      handlers.onAlertNew?.(data);
    });

    socket.on('risk_change', (data: RiskChange) => {
      handlers.onRiskChange?.(data);
    });

    socketRef.current = socket;

    return () => {
      if (farmId) {
        socket.emit('leave_farm', farmId);
      }
      socket.disconnect();
    };
  }, [farmId]);

  const joinFarm = useCallback((id: string) => {
    socketRef.current?.emit('join_farm', id);
  }, []);

  return { isConnected, joinFarm };
}
