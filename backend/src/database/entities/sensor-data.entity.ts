import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Sensor } from './sensor.entity';

/**
 * 센서 데이터 - TimescaleDB 하이퍼테이블
 * 보존 정책: 원본 90일, 1시간 집계 1년, 일별 집계 영구
 */
@Entity('sensor_data')
export class SensorData {
  @PrimaryColumn({ type: 'timestamp' })
  time: Date;

  @ManyToOne(() => Sensor, { nullable: false })
  @JoinColumn({ name: 'sensor_id' })
  sensor: Sensor;

  @PrimaryColumn({ name: 'sensor_id', type: 'uuid' })
  sensorId: string;

  @Column({ type: 'float' })
  value: number;

  @Column({ nullable: true, comment: '℃, %, ppm, A, V 등' })
  unit: string;

  @Column({ type: 'jsonb', nullable: true, comment: '추가 메타데이터' })
  metadata: object;
}
