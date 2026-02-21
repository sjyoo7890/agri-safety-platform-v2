import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farm } from './farm.entity';
import { AlertSeverity } from './alert.entity';

export enum EscalationTargetType {
  UPPER_MANAGER = 'upper_manager',
  EMERGENCY_119 = 'emergency_119',
  EMERGENCY_112 = 'emergency_112',
}

@Entity('escalation_rules')
export class EscalationRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Farm)
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @Column({ name: 'farm_id', type: 'uuid' })
  farmId: string;

  @Column({ type: 'enum', enum: AlertSeverity })
  severity: AlertSeverity;

  @Column({ type: 'int', comment: '에스컬레이션 단계 (1부터)' })
  step: number;

  @Column({ name: 'wait_minutes', type: 'int', comment: '미응답 대기 시간(분)' })
  waitMinutes: number;

  @Column({ name: 'target_type', type: 'enum', enum: EscalationTargetType })
  targetType: EscalationTargetType;

  @Column({ name: 'target_user_ids', type: 'uuid', array: true, nullable: true })
  targetUserIds: string[];

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
