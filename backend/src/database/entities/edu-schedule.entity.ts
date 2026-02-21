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

export enum ScheduleStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('edu_schedules')
export class EduSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: '교육 제목' })
  title: string;

  @ManyToOne(() => Farm, { nullable: true })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @Column({ name: 'farm_id', type: 'uuid', nullable: true })
  farmId: string;

  @Column({ name: 'content_ids', type: 'jsonb', default: [], comment: '교육 콘텐츠 ID 목록' })
  contentIds: string[];

  @Column({ name: 'instructor_name', nullable: true, comment: '교육 강사명' })
  instructorName: string;

  @Column({ name: 'scheduled_date', type: 'date', comment: '교육 예정일' })
  scheduledDate: string;

  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime: string;

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime: string;

  @Column({ nullable: true, comment: '교육 장소' })
  location: string;

  @Column({ name: 'max_participants', type: 'int', nullable: true })
  maxParticipants: number;

  @Column({ name: 'participant_ids', type: 'jsonb', default: [], comment: '참가 작업자 ID 목록' })
  participantIds: string[];

  @Column({ type: 'enum', enum: ScheduleStatus, default: ScheduleStatus.PLANNED })
  status: ScheduleStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
