import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farm } from './farm.entity';
import { Workplace } from './workplace.entity';

export enum KitType {
  WALL_MOUNTED = 'wall_mounted',
  VEHICLE_MOUNTED = 'vehicle_mounted',
}

export enum KitStatus {
  NORMAL = 'normal',
  OPENED = 'opened',
  ALARM = 'alarm',
  MAINTENANCE = 'maintenance',
}

@Entity('emergency_kits')
export class EmergencyKit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'serial_no', unique: true })
  serialNo: string;

  @Column({ type: 'enum', enum: KitType })
  type: KitType;

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

  @Column({ name: 'vehicle_id', nullable: true, comment: '차량탑재형인 경우 농기계 식별자' })
  vehicleId: string;

  @Column({ type: 'float', nullable: true })
  lat: number;

  @Column({ type: 'float', nullable: true })
  lng: number;

  @Column({ type: 'enum', enum: KitStatus, default: KitStatus.NORMAL })
  status: KitStatus;

  @Column({ name: 'battery_level', type: 'int', nullable: true })
  batteryLevel: number;

  @Column({ name: 'last_heartbeat', type: 'timestamp', nullable: true })
  lastHeartbeat: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
