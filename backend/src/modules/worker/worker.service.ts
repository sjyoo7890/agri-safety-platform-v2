import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Worker } from '../../database/entities/worker.entity';
import { SmartVest } from '../../database/entities/smart-vest.entity';
import { SensorData } from '../../database/entities/sensor-data.entity';
import { Alert } from '../../database/entities/alert.entity';

/** 작업자 실시간 상태 응답 */
export interface WorkerStatus {
  worker: {
    id: string;
    userId: string;
    name: string;
    age: number | null;
    gender: string | null;
    acclimatizationLevel: string | null;
    farmId: string;
    farmName: string;
  };
  vest: {
    id: string;
    serialNo: string;
    batteryLevel: number;
    commStatus: string;
    lastHeartbeat: string | null;
  } | null;
  vitals: {
    heartRate: number | null;
    bodyTemp: number | null;
  };
  riskLevel: string;
}

/** 생체신호 시계열 데이터 포인트 */
export interface VitalDataPoint {
  time: string;
  heartRate: number | null;
  bodyTemp: number | null;
}

/** 자세/동작 상태 */
export interface PostureStatus {
  posture: 'normal' | 'risky' | 'fallen';
  roll: number;
  pitch: number;
  lastUpdated: string;
}

/** 타임라인 이벤트 */
export interface TimelineEvent {
  time: string;
  endTime: string | null;
  type: 'work' | 'rest' | 'danger_event';
  label: string;
  metadata?: Record<string, unknown>;
}

/** 열 순응도 분석 결과 */
export interface AcclimatizationAnalysis {
  level: string;
  levelLabel: string;
  heatExposureHours14d: number;
  recommendedWorkMinutes: number;
  recommendedRestMinutes: number;
  dailyExposure: Array<{ date: string; hours: number }>;
}

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
    @InjectRepository(SmartVest)
    private readonly vestRepository: Repository<SmartVest>,
    @InjectRepository(SensorData)
    private readonly sensorDataRepository: Repository<SensorData>,
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {}

  /** 작업자 실시간 상태 (프로필 + 조끼 + 생체신호 + 위험등급) */
  async getStatus(workerId: string): Promise<WorkerStatus> {
    const worker = await this.workerRepository.findOne({
      where: { id: workerId },
      relations: ['user', 'farm'],
    });
    if (!worker) throw new NotFoundException('작업자를 찾을 수 없습니다.');

    const vest = await this.vestRepository.findOne({ where: { workerId } });

    // 실제로는 최신 센서 데이터에서 심박/체온을 가져와야 함
    // 현재는 시뮬레이션 데이터 반환
    const vitals = this.simulateVitals();
    const riskLevel = this.calculateRiskLevel(vitals);

    return {
      worker: {
        id: worker.id,
        userId: worker.userId,
        name: worker.user?.name ?? '(이름 없음)',
        age: worker.age,
        gender: worker.gender,
        acclimatizationLevel: worker.acclimatizationLevel,
        farmId: worker.farmId,
        farmName: worker.farm?.name ?? '',
      },
      vest: vest
        ? {
            id: vest.id,
            serialNo: vest.serialNo,
            batteryLevel: vest.batteryLevel,
            commStatus: vest.commStatus,
            lastHeartbeat: vest.lastHeartbeat?.toISOString() ?? null,
          }
        : null,
      vitals,
      riskLevel,
    };
  }

  /** 기간별 생체신호 이력 (차트 데이터) */
  async getVitals(workerId: string, from?: string, to?: string): Promise<VitalDataPoint[]> {
    // 작업자 존재 확인
    const worker = await this.workerRepository.findOne({ where: { id: workerId } });
    if (!worker) throw new NotFoundException('작업자를 찾을 수 없습니다.');

    // 실제로는 센서 데이터 테이블에서 심박/체온 시계열 데이터를 조회
    // 현재는 시뮬레이션 데이터 생성
    return this.simulateVitalsHistory(from, to);
  }

  /** 현재 자세/동작 상태 */
  async getPosture(workerId: string): Promise<PostureStatus> {
    const worker = await this.workerRepository.findOne({ where: { id: workerId } });
    if (!worker) throw new NotFoundException('작업자를 찾을 수 없습니다.');

    // 실제로는 IMU 데이터 기반으로 자세 판별
    return {
      posture: 'normal',
      roll: Math.round(Math.random() * 10),
      pitch: Math.round(Math.random() * 15),
      lastUpdated: new Date().toISOString(),
    };
  }

  /** 작업자 활동 타임라인 */
  async getTimeline(workerId: string): Promise<TimelineEvent[]> {
    const worker = await this.workerRepository.findOne({ where: { id: workerId } });
    if (!worker) throw new NotFoundException('작업자를 찾을 수 없습니다.');

    // 당일 알림 이력에서 위험 이벤트 추출
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alerts = await this.alertRepository.find({
      where: { workerId },
      order: { createdAt: 'DESC' },
      take: 20,
    });

    // 기본 타임라인 + 위험 이벤트 병합 (시뮬레이션)
    const timeline: TimelineEvent[] = [
      { time: this.todayTime('08:00'), endTime: this.todayTime('10:30'), type: 'work', label: '작업 (노지)' },
      { time: this.todayTime('10:30'), endTime: this.todayTime('10:50'), type: 'rest', label: '휴식' },
      { time: this.todayTime('10:50'), endTime: this.todayTime('12:00'), type: 'work', label: '작업 (노지)' },
      { time: this.todayTime('12:00'), endTime: this.todayTime('13:00'), type: 'rest', label: '점심휴식' },
      { time: this.todayTime('13:00'), endTime: null, type: 'work', label: '작업 (노지)' },
    ];

    // 실제 알림 이벤트 추가
    for (const alert of alerts) {
      timeline.push({
        time: alert.createdAt.toISOString(),
        endTime: null,
        type: 'danger_event',
        label: `위험 이벤트 - ${alert.type}`,
        metadata: { alertId: alert.id, severity: alert.severity },
      });
    }

    return timeline.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }

  /** 열 순응도 분석 결과 */
  async getAcclimatization(workerId: string): Promise<AcclimatizationAnalysis> {
    const worker = await this.workerRepository.findOne({ where: { id: workerId } });
    if (!worker) throw new NotFoundException('작업자를 찾을 수 없습니다.');

    const level = worker.acclimatizationLevel ?? 'C';
    const levelLabels: Record<string, string> = { A: '완전 순응', B: '부분 순응', C: '미순응' };
    const workMinutes: Record<string, number> = { A: 90, B: 50, C: 30 };
    const restMinutes: Record<string, number> = { A: 10, B: 15, C: 20 };

    // 14일간 노출 이력 시뮬레이션
    const dailyExposure: Array<{ date: string; hours: number }> = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyExposure.push({
        date: d.toISOString().slice(0, 10),
        hours: Math.round((2 + Math.random() * 4) * 10) / 10,
      });
    }

    const heatExposureHours14d = dailyExposure.reduce((sum, d) => sum + d.hours, 0);

    return {
      level,
      levelLabel: levelLabels[level] ?? '미순응',
      heatExposureHours14d: Math.round(heatExposureHours14d * 10) / 10,
      recommendedWorkMinutes: workMinutes[level] ?? 30,
      recommendedRestMinutes: restMinutes[level] ?? 20,
      dailyExposure,
    };
  }

  // ─── 시뮬레이션 헬퍼 ─────────────────────────────────

  private simulateVitals() {
    return {
      heartRate: 60 + Math.round(Math.random() * 40),
      bodyTemp: Math.round((36.0 + Math.random() * 1.5) * 10) / 10,
    };
  }

  private calculateRiskLevel(vitals: { heartRate: number | null; bodyTemp: number | null }): string {
    if (!vitals.heartRate || !vitals.bodyTemp) return 'normal';
    if (vitals.heartRate > 120 || vitals.bodyTemp > 38.5) return 'danger';
    if (vitals.heartRate > 100 || vitals.bodyTemp > 37.8) return 'warning';
    if (vitals.heartRate > 90 || vitals.bodyTemp > 37.3) return 'caution';
    return 'normal';
  }

  private simulateVitalsHistory(from?: string, to?: string): VitalDataPoint[] {
    const end = to ? new Date(to) : new Date();
    const start = from ? new Date(from) : new Date(end.getTime() - 8 * 60 * 60 * 1000);
    const points: VitalDataPoint[] = [];
    const interval = 5 * 60 * 1000; // 5분 간격

    let baseHR = 72;
    let baseTemp = 36.5;

    for (let t = start.getTime(); t <= end.getTime(); t += interval) {
      baseHR += (Math.random() - 0.48) * 4;
      baseTemp += (Math.random() - 0.48) * 0.1;
      baseHR = Math.max(55, Math.min(130, baseHR));
      baseTemp = Math.max(36.0, Math.min(39.0, baseTemp));

      points.push({
        time: new Date(t).toISOString(),
        heartRate: Math.round(baseHR),
        bodyTemp: Math.round(baseTemp * 10) / 10,
      });
    }

    return points;
  }

  private todayTime(hhmm: string): string {
    const today = new Date();
    const [h, m] = hhmm.split(':').map(Number);
    today.setHours(h, m, 0, 0);
    return today.toISOString();
  }
}
