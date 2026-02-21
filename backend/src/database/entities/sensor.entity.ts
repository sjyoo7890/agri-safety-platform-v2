import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Workplace } from './workplace.entity';

export enum SensorType {
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
  GAS_O2 = 'gas_o2',
  GAS_H2S = 'gas_h2s',
  GAS_NH3 = 'gas_nh3',
  GAS_CH4 = 'gas_ch4',
  CURRENT = 'current',
  VOLTAGE = 'voltage',
  WBGT = 'wbgt',
}

export enum SensorStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  CALIBRATING = 'calibrating',
}

@Entity('sensors')
export class Sensor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'serial_no', unique: true })
  serialNo: string;

  @Column({ type: 'enum', enum: SensorType })
  type: SensorType;

  @ManyToOne(() => Workplace, { nullable: false })
  @JoinColumn({ name: 'workplace_id' })
  workplace: Workplace;

  @Column({ name: 'workplace_id', type: 'uuid' })
  workplaceId: string;

  @Column({ type: 'float', nullable: true })
  lat: number;

  @Column({ type: 'float', nullable: true })
  lng: number;

  @Column({ type: 'enum', enum: SensorStatus, default: SensorStatus.OFFLINE })
  status: SensorStatus;

  @Column({
    name: 'threshold_config',
    type: 'jsonb',
    nullable: true,
    comment: '{ caution: number, warning: number, danger: number }',
  })
  thresholdConfig: { caution: number; warning: number; danger: number };

  @Column({ name: 'last_heartbeat', type: 'timestamp', nullable: true })
  lastHeartbeat: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
