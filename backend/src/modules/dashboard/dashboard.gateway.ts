import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

/**
 * 대시보드 실시간 WebSocket Gateway
 *
 * 이벤트:
 * - sensor_update: 센서 데이터 갱신
 * - worker_status: 작업자 상태 변경
 * - alert_new: 새 알림 발생
 * - risk_change: 위험 등급 변경
 */
@WebSocketGateway({
  namespace: '/ws/dashboard',
  cors: {
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : ['http://localhost:5173', 'http://localhost:80'],
    credentials: true,
  },
})
export class DashboardGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(DashboardGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`클라이언트 연결: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`클라이언트 해제: ${client.id}`);
  }

  /** 클라이언트가 특정 농장 룸에 참여 */
  @SubscribeMessage('join_farm')
  handleJoinFarm(client: Socket, farmId: string) {
    client.join(`farm:${farmId}`);
    this.logger.log(`${client.id} → farm:${farmId} 참여`);
    return { event: 'joined', farmId };
  }

  /** 클라이언트가 농장 룸에서 퇴장 */
  @SubscribeMessage('leave_farm')
  handleLeaveFarm(client: Socket, farmId: string) {
    client.leave(`farm:${farmId}`);
    return { event: 'left', farmId };
  }

  // ─── 서버 → 클라이언트 브로드캐스트 메서드 (다른 서비스에서 호출) ───

  /** 센서 데이터 갱신 알림 */
  emitSensorUpdate(farmId: string, data: {
    sensorId: string;
    type: string;
    value: number;
    unit: string;
    timestamp: string;
  }) {
    this.server.to(`farm:${farmId}`).emit('sensor_update', data);
  }

  /** 작업자 상태 변경 알림 */
  emitWorkerStatus(farmId: string, data: {
    workerId: string;
    name: string;
    status: string;
    heartRate?: number;
    bodyTemp?: number;
    lat?: number;
    lng?: number;
  }) {
    this.server.to(`farm:${farmId}`).emit('worker_status', data);
  }

  /** 새 알림 발생 */
  emitNewAlert(farmId: string, data: {
    alertId: string;
    type: string;
    severity: string;
    message: string;
    workerName?: string;
    timestamp: string;
  }) {
    this.server.to(`farm:${farmId}`).emit('alert_new', data);
    // 전체 구독자에게도 전송 (다중 농장 관제용)
    this.server.emit('alert_new', { ...data, farmId });
  }

  /** 위험 등급 변경 */
  emitRiskChange(farmId: string, data: {
    workplaceId: string;
    previousLevel: string;
    currentLevel: string;
    riskScore: number;
  }) {
    this.server.to(`farm:${farmId}`).emit('risk_change', data);
  }
}
