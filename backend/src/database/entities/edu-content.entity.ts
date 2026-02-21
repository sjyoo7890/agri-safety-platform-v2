import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EduAccidentType {
  FALL = 'FALL',
  ENTANGLE = 'ENTANGLE',
  HEAT = 'HEAT',
  FIRE = 'FIRE',
  ROLLOVER = 'ROLLOVER',
  COLLISION = 'COLLISION',
}

export enum EduContentType {
  VR_CONTENT = 'vr_content',
  KIT_TRAINING = 'kit_training',
  CLASSROOM = 'classroom',
}

export enum SimulatorType {
  SIX_AXIS = 'six_axis',
  TREADMILL = 'treadmill',
}

export enum EduDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum EduContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('edu_contents')
export class EduContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ name: 'accident_type', type: 'enum', enum: EduAccidentType })
  accidentType: EduAccidentType;

  @Column({ type: 'enum', enum: EduContentType })
  type: EduContentType;

  @Column({ name: 'simulator_type', type: 'enum', enum: SimulatorType, nullable: true })
  simulatorType: SimulatorType;

  @Column({ nullable: true })
  version: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'duration_min', type: 'int', nullable: true, comment: '예상 소요 시간(분)' })
  durationMin: number;

  @Column({ type: 'enum', enum: EduDifficulty, nullable: true })
  difficulty: EduDifficulty;

  @Column({ type: 'enum', enum: EduContentStatus, default: EduContentStatus.DRAFT })
  status: EduContentStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
