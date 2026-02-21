import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farm } from './farm.entity';
import { Workplace } from './workplace.entity';

export enum RiskLevel {
  NORMAL = 'normal',
  CAUTION = 'caution',
  WARNING = 'warning',
  DANGER = 'danger',
}

@Entity('risk_assessments')
export class RiskAssessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ name: 'risk_score', type: 'int', comment: '0~100' })
  riskScore: number;

  @Column({ name: 'risk_level', type: 'enum', enum: RiskLevel })
  riskLevel: RiskLevel;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '위험요인 목록 [{ code, name, score, source }]',
  })
  hazards: object[];

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '감소대책 목록 [{ code, action, priority }]',
  })
  countermeasures: object[];

  @Column({ name: 'assessed_at', type: 'timestamp' })
  assessedAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true, comment: '평가 유효기간' })
  expiresAt: Date;
}
