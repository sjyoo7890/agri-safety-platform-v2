import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farm } from './farm.entity';
import { SimulatorType } from './edu-content.entity';

export enum SimulatorStatus {
  ACTIVE = 'active',
  STANDBY = 'standby',
  MAINTENANCE = 'maintenance',
  ERROR = 'error',
}

@Entity('simulators')
export class Simulator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: '시뮬레이터 이름/식별코드' })
  name: string;

  @Column({ name: 'simulator_type', type: 'enum', enum: SimulatorType })
  simulatorType: SimulatorType;

  @ManyToOne(() => Farm, { nullable: true })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @Column({ name: 'farm_id', type: 'uuid', nullable: true })
  farmId: string;

  @Column({ nullable: true, comment: '설치 위치' })
  location: string;

  @Column({ type: 'enum', enum: SimulatorStatus, default: SimulatorStatus.STANDBY })
  status: SimulatorStatus;

  @Column({ name: 'total_sessions', type: 'int', default: 0, comment: '총 가동 횟수' })
  totalSessions: number;

  @Column({ name: 'emergency_stops', type: 'int', default: 0, comment: '비상정지 횟수' })
  emergencyStops: number;

  @Column({ name: 'last_maintenance_at', type: 'timestamp', nullable: true })
  lastMaintenanceAt: Date;

  @Column({ name: 'firmware_version', nullable: true })
  firmwareVersion: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
