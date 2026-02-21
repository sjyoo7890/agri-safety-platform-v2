import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Simulator, SimulatorStatus } from '../../database/entities';
import { SimulatorType } from '../../database/entities/edu-content.entity';

@Injectable()
export class SimulatorService {
  constructor(
    @InjectRepository(Simulator)
    private readonly repo: Repository<Simulator>,
  ) {}

  async findAll(): Promise<Simulator[]> {
    const list = await this.repo.find({ order: { name: 'ASC' } });
    if (list.length > 0) return list;
    return this.simulateDevices();
  }

  private simulateDevices(): Simulator[] {
    const devices: Partial<Simulator>[] = [
      {
        id: 'sim00001-0000-0000-0000-000000000001',
        name: '6축 탑승형 시뮬레이터 A',
        simulatorType: SimulatorType.SIX_AXIS,
        location: '안전교육센터 A동 1층',
        status: SimulatorStatus.ACTIVE,
        totalSessions: 1247,
        emergencyStops: 3,
        lastMaintenanceAt: new Date('2026-01-15'),
        firmwareVersion: 'v3.2.1',
        createdAt: new Date('2024-06-01'),
        updatedAt: new Date('2026-02-17'),
      },
      {
        id: 'sim00001-0000-0000-0000-000000000002',
        name: '6축 탑승형 시뮬레이터 B',
        simulatorType: SimulatorType.SIX_AXIS,
        location: '안전교육센터 A동 2층',
        status: SimulatorStatus.STANDBY,
        totalSessions: 983,
        emergencyStops: 1,
        lastMaintenanceAt: new Date('2026-02-01'),
        firmwareVersion: 'v3.2.1',
        createdAt: new Date('2024-06-01'),
        updatedAt: new Date('2026-02-17'),
      },
      {
        id: 'sim00001-0000-0000-0000-000000000003',
        name: '트레드밀형 시뮬레이터 A',
        simulatorType: SimulatorType.TREADMILL,
        location: '안전교육센터 B동 1층',
        status: SimulatorStatus.ACTIVE,
        totalSessions: 756,
        emergencyStops: 2,
        lastMaintenanceAt: new Date('2026-01-20'),
        firmwareVersion: 'v2.5.0',
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2026-02-17'),
      },
      {
        id: 'sim00001-0000-0000-0000-000000000004',
        name: '트레드밀형 시뮬레이터 B',
        simulatorType: SimulatorType.TREADMILL,
        location: '안전교육센터 B동 2층',
        status: SimulatorStatus.MAINTENANCE,
        totalSessions: 621,
        emergencyStops: 5,
        lastMaintenanceAt: new Date('2026-02-10'),
        firmwareVersion: 'v2.4.2',
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2026-02-17'),
      },
      {
        id: 'sim00001-0000-0000-0000-000000000005',
        name: '순회교육용 6축 이동형',
        simulatorType: SimulatorType.SIX_AXIS,
        location: '현재: 행복농장 출장',
        status: SimulatorStatus.ACTIVE,
        totalSessions: 342,
        emergencyStops: 0,
        lastMaintenanceAt: new Date('2026-02-05'),
        firmwareVersion: 'v3.1.0',
        createdAt: new Date('2025-03-01'),
        updatedAt: new Date('2026-02-17'),
      },
    ];
    return devices as Simulator[];
  }
}
