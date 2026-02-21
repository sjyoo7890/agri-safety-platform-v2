import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farm } from './farm.entity';

export enum WorkplaceType {
  OPEN_FIELD = 'open_field',
  GREENHOUSE = 'greenhouse',
  BARN = 'barn',
  ORCHARD = 'orchard',
  WAREHOUSE = 'warehouse',
}

@Entity('workplaces')
export class Workplace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Farm, { nullable: false })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @Column({ name: 'farm_id', type: 'uuid' })
  farmId: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: WorkplaceType })
  type: WorkplaceType;

  @Column({ type: 'float' })
  lat: number;

  @Column({ type: 'float' })
  lng: number;

  @Column({ type: 'jsonb', nullable: true, comment: 'GeoJSON polygon (작업장 영역)' })
  geofence: object;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
