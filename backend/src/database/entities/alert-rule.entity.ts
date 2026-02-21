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
import { AlertSeverity } from './alert.entity';

@Entity('alert_rules')
export class AlertRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Farm)
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @Column({ name: 'farm_id', type: 'uuid' })
  farmId: string;

  @Column({ type: 'enum', enum: AlertSeverity, comment: '위험등급' })
  severity: AlertSeverity;

  @Column({ type: 'jsonb', comment: "알림 채널 목록: ['dashboard','push','sms','vest','beacon']" })
  channels: string[];

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
