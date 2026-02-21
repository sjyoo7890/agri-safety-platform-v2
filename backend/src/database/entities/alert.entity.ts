import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farm } from './farm.entity';
import { Workplace } from './workplace.entity';
import { Worker } from './worker.entity';
import { User } from './user.entity';
import { AIPrediction } from './ai-prediction.entity';

export enum AlertType {
  FALL = 'FALL',
  ENTANGLE = 'ENTANGLE',
  HEAT = 'HEAT',
  FIRE = 'FIRE',
  ROLLOVER = 'ROLLOVER',
  COLLISION = 'COLLISION',
  DEVICE = 'DEVICE',
  SYSTEM = 'SYSTEM',
}

export enum AlertSeverity {
  INFO = 'info',
  CAUTION = 'caution',
  WARNING = 'warning',
  DANGER = 'danger',
}

export enum AlertStatus {
  SENT = 'sent',
  ACKNOWLEDGED = 'acknowledged',
  ESCALATED = 'escalated',
  RESOLVED = 'resolved',
}

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AlertType })
  type: AlertType;

  @Column({ type: 'enum', enum: AlertSeverity })
  severity: AlertSeverity;

  @ManyToOne(() => Farm)
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @Column({ name: 'farm_id', type: 'uuid', nullable: true })
  farmId: string;

  @ManyToOne(() => Workplace, { nullable: true })
  @JoinColumn({ name: 'workplace_id' })
  workplace: Workplace;

  @Column({ name: 'workplace_id', type: 'uuid', nullable: true })
  workplaceId: string;

  @ManyToOne(() => Worker, { nullable: true })
  @JoinColumn({ name: 'worker_id' })
  worker: Worker;

  @Column({ name: 'worker_id', type: 'uuid', nullable: true })
  workerId: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'message_tts', type: 'text', nullable: true, comment: 'TTS용 메시지' })
  messageTts: string;

  @Column({ type: 'jsonb', nullable: true, comment: "['dashboard', 'push', 'sms', 'vest', 'beacon']" })
  channels: string[];

  @Column({ name: 'target_user_ids', type: 'uuid', array: true, nullable: true, comment: '수신 대상 사용자 ID 목록' })
  targetUserIds: string[];

  @Column({ type: 'enum', enum: AlertStatus, default: AlertStatus.SENT })
  status: AlertStatus;

  @Column({ name: 'acknowledged_at', type: 'timestamp', nullable: true })
  acknowledgedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'acknowledged_by' })
  acknowledgedByUser: User;

  @Column({ name: 'acknowledged_by', type: 'uuid', nullable: true })
  acknowledgedBy: string;

  @ManyToOne(() => AIPrediction, { nullable: true })
  @JoinColumn({ name: 'prediction_id' })
  prediction: AIPrediction;

  @Column({ name: 'prediction_id', type: 'uuid', nullable: true })
  predictionId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
