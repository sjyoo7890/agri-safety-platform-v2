import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartVest } from '../../database/entities/smart-vest.entity';
import { EmergencyKit } from '../../database/entities/emergency-kit.entity';
import { Sensor } from '../../database/entities/sensor.entity';

export interface AssetSummary {
  smartVests: {
    total: number;
    online: number;
    offline: number;
    error: number;
    assigned: number;
    unassigned: number;
  };
  emergencyKits: {
    total: number;
    normal: number;
    opened: number;
    alarm: number;
    maintenance: number;
  };
  sensors: {
    total: number;
    online: number;
    offline: number;
    error: number;
    calibrating: number;
  };
}

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(SmartVest)
    private readonly vestRepository: Repository<SmartVest>,
    @InjectRepository(EmergencyKit)
    private readonly kitRepository: Repository<EmergencyKit>,
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
  ) {}

  /** 전체 장비 자산 요약 조회 */
  async getSummary(farmId?: string): Promise<AssetSummary> {
    const [vests, kits, sensors] = await Promise.all([
      this.getVestSummary(farmId),
      this.getKitSummary(farmId),
      this.getSensorSummary(farmId),
    ]);

    return { smartVests: vests, emergencyKits: kits, sensors };
  }

  /** 전체 장비 목록 조회 (자산 대장) */
  async getAssetList(farmId?: string) {
    const where = farmId ? { farmId } : {};

    const [vests, kits, sensors] = await Promise.all([
      this.vestRepository.find({ where, relations: ['farm', 'worker'], order: { createdAt: 'DESC' } }),
      this.kitRepository.find({ where, relations: ['farm', 'workplace'], order: { createdAt: 'DESC' } }),
      this.sensorRepository.find({
        where: farmId ? { workplace: { farmId } } : {},
        relations: ['workplace'],
        order: { createdAt: 'DESC' },
      }),
    ]);

    return {
      smartVests: vests,
      emergencyKits: kits,
      sensors,
    };
  }

  private async getVestSummary(farmId?: string) {
    const where = farmId ? { farmId } : {};
    const vests = await this.vestRepository.find({ where });
    return {
      total: vests.length,
      online: vests.filter((v) => v.commStatus === 'online').length,
      offline: vests.filter((v) => v.commStatus === 'offline').length,
      error: vests.filter((v) => v.commStatus === 'error').length,
      assigned: vests.filter((v) => v.workerId !== null).length,
      unassigned: vests.filter((v) => v.workerId === null).length,
    };
  }

  private async getKitSummary(farmId?: string) {
    const where = farmId ? { farmId } : {};
    const kits = await this.kitRepository.find({ where });
    return {
      total: kits.length,
      normal: kits.filter((k) => k.status === 'normal').length,
      opened: kits.filter((k) => k.status === 'opened').length,
      alarm: kits.filter((k) => k.status === 'alarm').length,
      maintenance: kits.filter((k) => k.status === 'maintenance').length,
    };
  }

  private async getSensorSummary(farmId?: string) {
    const query = this.sensorRepository.createQueryBuilder('sensor');
    if (farmId) {
      query
        .innerJoin('sensor.workplace', 'workplace')
        .where('workplace.farmId = :farmId', { farmId });
    }
    const sensors = await query.getMany();
    return {
      total: sensors.length,
      online: sensors.filter((s) => s.status === 'online').length,
      offline: sensors.filter((s) => s.status === 'offline').length,
      error: sensors.filter((s) => s.status === 'error').length,
      calibrating: sensors.filter((s) => s.status === 'calibrating').length,
    };
  }
}
