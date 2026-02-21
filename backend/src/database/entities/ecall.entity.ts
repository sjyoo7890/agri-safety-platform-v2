import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farm } from './farm.entity';
import { Worker } from './worker.entity';
import { Alert, AlertType } from './alert.entity';

export enum ECallTriggerType {
  AUTO = 'auto',
  MANUAL = 'manual',
  DEVICE = 'device',
}

export enum ECallStatus {
  TRIGGERED = 'triggered',
  DISPATCHED = 'dispatched',
  RESOLVED = 'resolved',
  CANCELLED = 'cancelled',
}

@Entity('ecalls')
export class ECall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Alert, { nullable: true })
  @JoinColumn({ name: 'alert_id' })
  alert: Alert;

  @Column({ name: 'alert_id', type: 'uuid', nullable: true })
  alertId: string;

  @ManyToOne(() => Farm)
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @Column({ name: 'farm_id', type: 'uuid' })
  farmId: string;

  @ManyToOne(() => Worker, { nullable: true })
  @JoinColumn({ name: 'worker_id' })
  worker: Worker;

  @Column({ name: 'worker_id', type: 'uuid', nullable: true })
  workerId: string;

  @Column({ name: 'trigger_type', type: 'enum', enum: ECallTriggerType })
  triggerType: ECallTriggerType;

  @Column({ type: 'float', nullable: true })
  lat: number;

  @Column({ type: 'float', nullable: true })
  lng: number;

  @Column({ name: 'worker_info', type: 'jsonb', nullable: true, comment: '작업자 정보 스냅샷 (이름, 연락처, 생체신호 등)' })
  workerInfo: Record<string, unknown>;

  @Column({ name: 'accident_type', type: 'enum', enum: AlertType, nullable: true })
  accidentType: AlertType;

  @Column({ type: 'enum', enum: ECallStatus, default: ECallStatus.TRIGGERED })
  status: ECallStatus;

  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
