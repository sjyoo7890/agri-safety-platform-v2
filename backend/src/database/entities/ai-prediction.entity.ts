import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farm } from './farm.entity';
import { Worker } from './worker.entity';

export enum PredictionModelType {
  FALL = 'FALL',
  ENTANGLE = 'ENTANGLE',
  HEAT = 'HEAT',
  FIRE = 'FIRE',
  ROLLOVER = 'ROLLOVER',
  COLLISION = 'COLLISION',
}

@Entity('ai_predictions')
export class AIPrediction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'model_type', type: 'enum', enum: PredictionModelType })
  modelType: PredictionModelType;

  @ManyToOne(() => Farm, { nullable: true })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @Column({ name: 'farm_id', type: 'uuid', nullable: true })
  farmId: string;

  @ManyToOne(() => Worker, { nullable: true })
  @JoinColumn({ name: 'worker_id' })
  worker: Worker;

  @Column({ name: 'worker_id', type: 'uuid', nullable: true })
  workerId: string;

  @Column({ name: 'input_summary', type: 'jsonb', nullable: true, comment: '입력 데이터 요약' })
  inputSummary: object;

  @Column({ type: 'float', comment: '위험도 점수 0~100' })
  prediction: number;

  @Column({ type: 'float', comment: '신뢰도 0~1' })
  confidence: number;

  @Column({
    name: 'xai_result',
    type: 'jsonb',
    nullable: true,
    comment: 'SHAP/LIME 분석 결과 [{ feature, contribution }]',
  })
  xaiResult: object[];

  @Column({ name: 'llm_message', type: 'text', nullable: true, comment: 'LLM 자연어 변환 메시지' })
  llmMessage: string;

  @Column({ name: 'is_false_alarm', default: false, comment: '오경보 여부 (사후 마킹)' })
  isFalseAlarm: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
