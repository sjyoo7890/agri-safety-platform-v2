import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Worker } from './worker.entity';
import { EduContent } from './edu-content.entity';

@Entity('educations')
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Worker, { nullable: false })
  @JoinColumn({ name: 'worker_id' })
  worker: Worker;

  @Column({ name: 'worker_id', type: 'uuid' })
  workerId: string;

  @ManyToOne(() => EduContent, { nullable: false })
  @JoinColumn({ name: 'content_id' })
  content: EduContent;

  @Column({ name: 'content_id', type: 'uuid' })
  contentId: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'int', nullable: true, comment: '0~100' })
  score: number;

  @Column({ name: 'duration_min', type: 'int', nullable: true, comment: '교육 소요 시간(분)' })
  durationMin: number;

  @Column({
    name: 'weakness_analysis',
    type: 'jsonb',
    nullable: true,
    comment: 'AI 분석 취약점 [{ type, description }]',
  })
  weaknessAnalysis: object[];

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
