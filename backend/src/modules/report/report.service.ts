import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Accident } from '../../database/entities/accident.entity';
import { AIPrediction } from '../../database/entities/ai-prediction.entity';
import { Alert } from '../../database/entities/alert.entity';
import { Worker } from '../../database/entities/worker.entity';

/** 월별 사고 추이 */
export interface MonthlyTrend {
  month: string;
  accidents: number;
  nearMisses: number;
}

/** 사고유형별 분포 */
export interface TypeDistribution {
  type: string;
  label: string;
  count: number;
  percentage: number;
}

/** 농장별 알림 빈도 */
export interface FarmAlertFrequency {
  farmId: string;
  farmName: string;
  count: number;
}

/** 시간대별 사고 히트맵 */
export interface HourlyHeatmap {
  day: number;
  dayLabel: string;
  hour: number;
  count: number;
}

/** 오경보율 추이 */
export interface FalseAlarmTrend {
  month: string;
  totalAlerts: number;
  falseAlarms: number;
  rate: number;
}

/** 작업자 안전 기록부 */
export interface WorkerSafetyRecord {
  worker: {
    id: string;
    name: string;
    age: number | null;
    farmName: string;
  };
  accidentCount: number;
  nearMissCount: number;
  dangerExposureHours: number;
  recentAccidents: Array<{ id: string; type: string; severity: string; occurredAt: string }>;
}

const TYPE_LABELS: Record<string, string> = {
  FALL: '추락/넘어짐', ENTANGLE: '끼임/감김', HEAT: '온열질환/질식',
  FIRE: '전기화재', ROLLOVER: '차량 전도/전복', COLLISION: '농기계-작업자 충돌', OTHER: '기타',
};

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Accident)
    private readonly accidentRepository: Repository<Accident>,
    @InjectRepository(AIPrediction)
    private readonly predictionRepository: Repository<AIPrediction>,
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
  ) {}

  /** 통계 데이터 통합 조회 */
  async getStatistics(from?: string, to?: string, farmId?: string) {
    const [monthlyTrend, typeDistribution, farmAlertFrequency, hourlyHeatmap, falseAlarmTrend] =
      await Promise.all([
        this.getMonthlyTrend(from, to, farmId),
        this.getTypeDistribution(from, to, farmId),
        this.getFarmAlertFrequency(from, to),
        this.getHourlyHeatmap(from, to, farmId),
        this.getFalseAlarmTrend(from, to),
      ]);

    return { monthlyTrend, typeDistribution, farmAlertFrequency, hourlyHeatmap, falseAlarmTrend };
  }

  /** 월별 사고 추이 */
  async getMonthlyTrend(from?: string, to?: string, farmId?: string): Promise<MonthlyTrend[]> {
    const qb = this.accidentRepository.createQueryBuilder('a');
    if (from && to) qb.where('a.occurred_at BETWEEN :from AND :to', { from, to });
    if (farmId) qb.andWhere('a.farm_id = :farmId', { farmId });

    const accidents = await qb.getMany();

    // DB 데이터가 없으면 시뮬레이션
    if (accidents.length === 0) return this.simulateMonthlyTrend();

    const map = new Map<string, { accidents: number; nearMisses: number }>();
    for (const a of accidents) {
      const month = a.occurredAt.toISOString().slice(0, 7);
      const entry = map.get(month) ?? { accidents: 0, nearMisses: 0 };
      if (a.isNearMiss) entry.nearMisses++;
      else entry.accidents++;
      map.set(month, entry);
    }

    return Array.from(map.entries())
      .map(([month, v]) => ({ month, ...v }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  /** 사고유형별 분포 */
  async getTypeDistribution(from?: string, to?: string, farmId?: string): Promise<TypeDistribution[]> {
    const qb = this.accidentRepository.createQueryBuilder('a');
    if (from && to) qb.where('a.occurred_at BETWEEN :from AND :to', { from, to });
    if (farmId) qb.andWhere('a.farm_id = :farmId', { farmId });

    const accidents = await qb.getMany();
    if (accidents.length === 0) return this.simulateTypeDistribution();

    const counts: Record<string, number> = {};
    for (const a of accidents) {
      counts[a.type] = (counts[a.type] || 0) + 1;
    }
    const total = accidents.length;

    return Object.entries(counts)
      .map(([type, count]) => ({
        type,
        label: TYPE_LABELS[type] ?? type,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }

  /** 농장별 알림 빈도 */
  async getFarmAlertFrequency(from?: string, to?: string): Promise<FarmAlertFrequency[]> {
    const qb = this.alertRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.farm', 'farm');
    if (from && to) qb.where('a.created_at BETWEEN :from AND :to', { from, to });

    const alerts = await qb.getMany();
    if (alerts.length === 0) return this.simulateFarmAlerts();

    const map = new Map<string, { farmName: string; count: number }>();
    for (const a of alerts) {
      if (!a.farmId) continue;
      const entry = map.get(a.farmId) ?? { farmName: a.farm?.name ?? '', count: 0 };
      entry.count++;
      map.set(a.farmId, entry);
    }

    return Array.from(map.entries())
      .map(([farmId, v]) => ({ farmId, farmName: v.farmName, count: v.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /** 시간대별 히트맵 */
  async getHourlyHeatmap(from?: string, to?: string, farmId?: string): Promise<HourlyHeatmap[]> {
    const qb = this.accidentRepository.createQueryBuilder('a');
    if (from && to) qb.where('a.occurred_at BETWEEN :from AND :to', { from, to });
    if (farmId) qb.andWhere('a.farm_id = :farmId', { farmId });

    const accidents = await qb.getMany();
    if (accidents.length === 0) return this.simulateHeatmap();

    const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
    const map = new Map<string, number>();
    for (const a of accidents) {
      const d = new Date(a.occurredAt);
      const key = `${d.getDay()}-${d.getHours()}`;
      map.set(key, (map.get(key) || 0) + 1);
    }

    const result: HourlyHeatmap[] = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 6; hour < 20; hour++) {
        result.push({ day, dayLabel: dayLabels[day], hour, count: map.get(`${day}-${hour}`) ?? 0 });
      }
    }
    return result;
  }

  /** 오경보율 추이 */
  async getFalseAlarmTrend(from?: string, to?: string): Promise<FalseAlarmTrend[]> {
    const predictions = await this.predictionRepository.find();
    if (predictions.length === 0) return this.simulateFalseAlarmTrend();

    const map = new Map<string, { total: number; false: number }>();
    for (const p of predictions) {
      const month = p.createdAt.toISOString().slice(0, 7);
      const entry = map.get(month) ?? { total: 0, false: 0 };
      entry.total++;
      if (p.isFalseAlarm) entry.false++;
      map.set(month, entry);
    }

    return Array.from(map.entries())
      .map(([month, v]) => ({
        month,
        totalAlerts: v.total,
        falseAlarms: v.false,
        rate: v.total > 0 ? Math.round((v.false / v.total) * 1000) / 10 : 0,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  /** 작업자 안전 기록부 */
  async getWorkerSafetyRecord(workerId: string): Promise<WorkerSafetyRecord> {
    const worker = await this.workerRepository.findOne({
      where: { id: workerId },
      relations: ['user', 'farm'],
    });
    if (!worker) {
      return {
        worker: { id: workerId, name: '(알 수 없음)', age: null, farmName: '' },
        accidentCount: 0, nearMissCount: 0, dangerExposureHours: 0, recentAccidents: [],
      };
    }

    const accidents = await this.accidentRepository.find({
      where: { workerId },
      order: { occurredAt: 'DESC' },
      take: 20,
    });

    const accidentCount = accidents.filter((a) => !a.isNearMiss).length;
    const nearMissCount = accidents.filter((a) => a.isNearMiss).length;

    return {
      worker: {
        id: worker.id,
        name: worker.user?.name ?? '',
        age: worker.age,
        farmName: worker.farm?.name ?? '',
      },
      accidentCount,
      nearMissCount,
      dangerExposureHours: Math.round((20 + Math.random() * 60) * 10) / 10,
      recentAccidents: accidents.slice(0, 10).map((a) => ({
        id: a.id,
        type: a.type,
        severity: a.severity,
        occurredAt: a.occurredAt.toISOString(),
      })),
    };
  }

  // ─── 시뮬레이션 ─────────────────────────────────────

  private simulateMonthlyTrend(): MonthlyTrend[] {
    const result: MonthlyTrend[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      result.push({
        month: d.toISOString().slice(0, 7),
        accidents: Math.round(2 + Math.random() * 8),
        nearMisses: Math.round(5 + Math.random() * 15),
      });
    }
    return result;
  }

  private simulateTypeDistribution(): TypeDistribution[] {
    const data = [
      { type: 'FALL', count: 35 }, { type: 'HEAT', count: 25 },
      { type: 'ENTANGLE', count: 15 }, { type: 'COLLISION', count: 12 },
      { type: 'ROLLOVER', count: 8 }, { type: 'FIRE', count: 5 },
    ];
    const total = data.reduce((s, d) => s + d.count, 0);
    return data.map((d) => ({
      ...d, label: TYPE_LABELS[d.type] ?? d.type,
      percentage: Math.round((d.count / total) * 100),
    }));
  }

  private simulateFarmAlerts(): FarmAlertFrequency[] {
    return [
      { farmId: '1', farmName: '행복 농장', count: 42 },
      { farmId: '2', farmName: '푸른들 농장', count: 38 },
      { farmId: '3', farmName: '새벽 농장', count: 25 },
      { farmId: '4', farmName: '해맑은 농장', count: 18 },
      { farmId: '5', farmName: '풍요 농장', count: 12 },
    ];
  }

  private simulateHeatmap(): HourlyHeatmap[] {
    const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
    const result: HourlyHeatmap[] = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 6; hour < 20; hour++) {
        const isWorkday = day >= 1 && day <= 5;
        const isPeakHour = hour >= 10 && hour <= 15;
        const base = isWorkday ? (isPeakHour ? 3 : 1) : 0;
        result.push({ day, dayLabel: dayLabels[day], hour, count: Math.round(base + Math.random() * 3) });
      }
    }
    return result;
  }

  private simulateFalseAlarmTrend(): FalseAlarmTrend[] {
    const result: FalseAlarmTrend[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const total = Math.round(50 + Math.random() * 100);
      const falseAlarms = Math.round(total * (0.03 + Math.random() * 0.07));
      result.push({
        month: d.toISOString().slice(0, 7),
        totalAlerts: total,
        falseAlarms,
        rate: Math.round((falseAlarms / total) * 1000) / 10,
      });
    }
    return result;
  }
}
