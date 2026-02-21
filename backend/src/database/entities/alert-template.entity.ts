import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AlertSeverity, AlertType } from './alert.entity';

@Entity('alert_templates')
export class AlertTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'alert_type', type: 'enum', enum: AlertType })
  alertType: AlertType;

  @Column({ type: 'enum', enum: AlertSeverity })
  severity: AlertSeverity;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ name: 'message_template', type: 'text', comment: '변수 치환 포맷: {{workerName}}, {{farmName}} 등' })
  messageTemplate: string;

  @Column({ name: 'tts_template', type: 'text', nullable: true, comment: 'TTS용 메시지 템플릿' })
  ttsTemplate: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
