import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Worker } from './worker.entity';
import { Farm } from './farm.entity';

export enum VestModuleType {
  OPEN_FIELD = 'open_field',
  LIVESTOCK = 'livestock',
  ORCHARD = 'orchard',
}

export enum CommStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
}

export enum CommType {
  BLE = 'ble',
  LORA = 'lora',
  LTE = 'lte',
}

@Entity('smart_vests')
export class SmartVest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'serial_no', unique: true })
  serialNo: string;

  @Column({ name: 'module_type', type: 'enum', enum: VestModuleType })
  moduleType: VestModuleType;

  @ManyToOne(() => Worker, { nullable: true })
  @JoinColumn({ name: 'worker_id' })
  worker: Worker;

  @Column({ name: 'worker_id', type: 'uuid', nullable: true })
  workerId: string;

  @ManyToOne(() => Farm, { nullable: false })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @Column({ name: 'farm_id', type: 'uuid' })
  farmId: string;

  @Column({ name: 'battery_level', type: 'int', default: 100, comment: '0~100' })
  batteryLevel: number;

  @Column({ name: 'comm_status', type: 'enum', enum: CommStatus, default: CommStatus.OFFLINE })
  commStatus: CommStatus;

  @Column({ name: 'comm_type', type: 'enum', enum: CommType, nullable: true })
  commType: CommType;

  @Column({ name: 'last_heartbeat', type: 'timestamp', nullable: true })
  lastHeartbeat: Date;

  @Column({ name: 'firmware_ver', nullable: true })
  firmwareVer: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
