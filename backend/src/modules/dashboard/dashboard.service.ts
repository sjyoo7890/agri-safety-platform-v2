import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Worker } from '../../database/entities/worker.entity';
import { SmartVest } from '../../database/entities/smart-vest.entity';
import { Sensor } from '../../database/entities/sensor.entity';
import { Alert } from '../../database/entities/alert.entity';
import { Workplace } from '../../database/entities/workplace.entity';
import { Farm } from '../../database/entities/farm.entity';
import { RiskAssessment } from '../../database/entities/risk-assessment.entity';

export interface DashboardOverview {
  riskSummary: {
    normal: number;
    caution: number;
    warning: number;
    danger: number;
  };
  workerSummary: {
    total: number;
    active: number;
    resting: number;
    danger: number;
    offline: number;
  };
  alertSummary: {
    total24h: number;
    unacknowledged: number;
    byType: Record<string, number>;
  };
  deviceSummary: {
    vestsOnline: number;
    vestsTotal: number;
    sensorsOnline: number;
    sensorsTotal: number;
  };
  farmCount: number;
}

export interface MapMarker {
  id: string;
  type: 'worker' | 'sensor' | 'workplace' | 'kit';
  lat: number;
  lng: number;
  name: string;
  status: string;
  riskLevel?: string;
  metadata?: Record<string, unknown>;
}

export interface MapData {
  farms: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    farmType: string;
    riskLevel: string;
  }>;
  workplaces: Array<{
    id: string;
    farmId: string;
    name: string;
    type: string;
    lat: number;
    lng: number;
    geofence: object | null;
  }>;
  workers: MapMarker[];
  sensors: MapMarker[];
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
    @InjectRepository(SmartVest)
    private readonly vestRepository: Repository<SmartVest>,
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    @InjectRepository(Workplace)
    private readonly workplaceRepository: Repository<Workplace>,
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(RiskAssessment)
    private readonly riskRepository: Repository<RiskAssessment>,
  ) {}

  /** 대시보드 통합 요약 데이터 */
  async getOverview(farmId?: string): Promise<DashboardOverview> {
    const [riskSummary, workerSummary, alertSummary, deviceSummary, farmCount] =
      await Promise.all([
        this.getRiskSummary(farmId),
        this.getWorkerSummary(farmId),
        this.getAlertSummary(farmId),
        this.getDeviceSummary(farmId),
        farmId ? 1 : this.farmRepository.count(),
      ]);

    return { riskSummary, workerSummary, alertSummary, deviceSummary, farmCount };
  }

  /** GIS 지도 데이터 */
  async getMapData(farmId?: string): Promise<MapData> {
    const farmWhere = farmId ? { id: farmId } : {};

    const [farms, workplaces, workers, sensors] = await Promise.all([
      this.getFarmMarkers(farmWhere),
      this.getWorkplaceMarkers(farmId),
      this.getWorkerMarkers(farmId),
      this.getSensorMarkers(farmId),
    ]);

    return { farms, workplaces, workers, sensors };
  }

  // ─── 내부 헬퍼 ─────────────────────────────────────────

  private async getRiskSummary(farmId?: string) {
    const where = farmId ? { farmId } : {};
    const assessments = await this.riskRepository.find({ where });

    const summary = { normal: 0, caution: 0, warning: 0, danger: 0 };
    for (const a of assessments) {
      if (a.riskLevel in summary) {
        summary[a.riskLevel as keyof typeof summary]++;
      }
    }

    // 평가가 없으면 작업장 수를 normal로
    if (assessments.length === 0) {
      const wpWhere = farmId ? { farmId } : {};
      summary.normal = await this.workplaceRepository.count({ where: wpWhere });
    }

    return summary;
  }

  private async getWorkerSummary(farmId?: string) {
    const where = farmId ? { farmId } : {};
    const workers = await this.workerRepository.find({ where });
    const vests = await this.vestRepository.find({
      where: farmId ? { farmId } : {},
    });

    const vestMap = new Map(
      vests.filter((v) => v.workerId).map((v) => [v.workerId, v]),
    );

    let active = 0;
    let offline = 0;
    let danger = 0;

    for (const w of workers) {
      const vest = vestMap.get(w.id);
      if (!vest || vest.commStatus === 'offline') {
        offline++;
      } else if (vest.commStatus === 'error') {
        danger++;
      } else {
        active++;
      }
    }

    return {
      total: workers.length,
      active,
      resting: 0,
      danger,
      offline,
    };
  }

  private async getAlertSummary(farmId?: string) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const query = this.alertRepository
      .createQueryBuilder('alert')
      .where('alert.created_at >= :since', { since });

    if (farmId) {
      query.andWhere('alert.farm_id = :farmId', { farmId });
    }

    const alerts = await query.getMany();

    const byType: Record<string, number> = {};
    let unacknowledged = 0;

    for (const a of alerts) {
      byType[a.type] = (byType[a.type] || 0) + 1;
      if (a.status === 'sent') unacknowledged++;
    }

    return { total24h: alerts.length, unacknowledged, byType };
  }

  private async getDeviceSummary(farmId?: string) {
    const vestWhere = farmId ? { farmId } : {};
    const vests = await this.vestRepository.find({ where: vestWhere });

    const sensorQuery = this.sensorRepository.createQueryBuilder('sensor');
    if (farmId) {
      sensorQuery
        .innerJoin('sensor.workplace', 'wp')
        .where('wp.farm_id = :farmId', { farmId });
    }
    const sensors = await sensorQuery.getMany();

    return {
      vestsOnline: vests.filter((v) => v.commStatus === 'online').length,
      vestsTotal: vests.length,
      sensorsOnline: sensors.filter((s) => s.status === 'online').length,
      sensorsTotal: sensors.length,
    };
  }

  private async getFarmMarkers(where: Record<string, unknown>) {
    const farms = await this.farmRepository.find({ where });
    return farms.map((f) => ({
      id: f.id,
      name: f.name,
      lat: f.lat,
      lng: f.lng,
      farmType: f.farmType || 'open_field',
      riskLevel: 'normal',
    }));
  }

  private async getWorkplaceMarkers(farmId?: string) {
    const where = farmId ? { farmId } : {};
    const workplaces = await this.workplaceRepository.find({ where });
    return workplaces.map((wp) => ({
      id: wp.id,
      farmId: wp.farmId,
      name: wp.name,
      type: wp.type,
      lat: wp.lat,
      lng: wp.lng,
      geofence: wp.geofence || null,
    }));
  }

  private async getWorkerMarkers(farmId?: string): Promise<MapMarker[]> {
    const vestWhere = farmId ? { farmId } : {};
    const vests = await this.vestRepository.find({
      where: { ...vestWhere },
      relations: ['worker'],
    });

    return vests
      .filter((v) => v.worker && v.commStatus === 'online')
      .map((v) => ({
        id: v.workerId!,
        type: 'worker' as const,
        lat: 0,  // 실제로는 최신 위치 데이터 필요
        lng: 0,
        name: '',
        status: v.commStatus,
        riskLevel: 'normal',
        metadata: {
          vestId: v.id,
          batteryLevel: v.batteryLevel,
          commType: v.commType,
        },
      }));
  }

  private async getSensorMarkers(farmId?: string): Promise<MapMarker[]> {
    const query = this.sensorRepository
      .createQueryBuilder('sensor')
      .leftJoinAndSelect('sensor.workplace', 'wp');

    if (farmId) {
      query.where('wp.farm_id = :farmId', { farmId });
    }

    const sensors = await query.getMany();

    return sensors.map((s) => ({
      id: s.id,
      type: 'sensor' as const,
      lat: s.lat || s.workplace?.lat || 0,
      lng: s.lng || s.workplace?.lng || 0,
      name: `${s.type} (${s.serialNo})`,
      status: s.status,
      metadata: {
        sensorType: s.type,
        workplaceId: s.workplaceId,
        thresholdConfig: s.thresholdConfig,
      },
    }));
  }
}
