import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Worker } from './worker.entity';
import { Farm } from './farm.entity';

export enum KitTrainingType {
  STATIONARY = 'stationary',
  MOUNTED = 'mounted',
}

@Entity('kit_trainings')
export class KitTraining {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Worker, { nullable: false })
  @JoinColumn({ name: 'worker_id' })
  worker: Worker;

  @Column({ name: 'worker_id', type: 'uuid' })
  workerId: string;

  @ManyToOne(() => Farm, { nullable: true })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @Column({ name: 'farm_id', type: 'uuid', nullable: true })
  farmId: string;

  @Column({ name: 'training_type', type: 'enum', enum: KitTrainingType, comment: '거치형/탑재형' })
  trainingType: KitTrainingType;

  @Column({ name: 'training_date', type: 'timestamp' })
  trainingDate: Date;

  @Column({ type: 'int', nullable: true, comment: '평가 점수 0~100' })
  score: number;

  @Column({ type: 'boolean', default: false, comment: '합격 여부' })
  passed: boolean;

  @Column({ name: 'duration_min', type: 'int', nullable: true, comment: '실습 소요 시간(분)' })
  durationMin: number;

  @Column({ type: 'text', nullable: true, comment: '평가 코멘트' })
  remarks: string;

  @Column({ name: 'evaluator_name', nullable: true, comment: '평가자명' })
  evaluatorName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
