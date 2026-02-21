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
import { Workplace } from './workplace.entity';
import { Worker } from './worker.entity';
import { User } from './user.entity';

export enum AccidentType {
  FALL = 'FALL',
  ENTANGLE = 'ENTANGLE',
  HEAT = 'HEAT',
  FIRE = 'FIRE',
  ROLLOVER = 'ROLLOVER',
  COLLISION = 'COLLISION',
  OTHER = 'OTHER',
}

export enum AccidentSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  FATAL = 'fatal',
}

@Entity('accidents')
export class Accident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AccidentType })
  type: AccidentType;

  @Column({ type: 'enum', enum: AccidentSeverity })
  severity: AccidentSeverity;

  @Column({ name: 'is_near_miss', default: false, comment: '아차사고 여부' })
  isNearMiss: boolean;

  @ManyToOne(() => Farm, { nullable: false })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @Column({ name: 'farm_id', type: 'uuid' })
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

  @Column({ name: 'occurred_at', type: 'timestamp' })
  occurredAt: Date;

  @Column({ type: 'text', nullable: true, comment: '사고 경위' })
  description: string;

  @Column({ type: 'text', nullable: true, comment: '원인 분석' })
  cause: string;

  @Column({ name: 'actions_taken', type: 'text', nullable: true, comment: '조치사항' })
  actionsTaken: string;

  @Column({ type: 'jsonb', nullable: true, comment: '첨부파일 URL 목록' })
  attachments: string[];

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
