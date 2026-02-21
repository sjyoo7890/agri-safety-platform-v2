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
import { AlertSeverity, AlertType } from './alert.entity';

@Entity('alert_recipients')
export class AlertRecipient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Farm)
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @Column({ name: 'farm_id', type: 'uuid' })
  farmId: string;

  @Column({ type: 'varchar', length: 100, comment: '수신자 그룹명' })
  name: string;

  @Column({ type: 'enum', enum: AlertSeverity, comment: '대상 위험등급' })
  severity: AlertSeverity;

  @Column({ name: 'alert_type', type: 'enum', enum: AlertType, nullable: true, comment: '특정 사고유형 (null이면 전체)' })
  alertType: AlertType | null;

  @Column({ name: 'user_ids', type: 'uuid', array: true, comment: '수신자 사용자 ID 목록' })
  userIds: string[];

  @Column({ name: 'include_external', type: 'boolean', default: false, comment: '119/112 포함 여부' })
  includeExternal: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
