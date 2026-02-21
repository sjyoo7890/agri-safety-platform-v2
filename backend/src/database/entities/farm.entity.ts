import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum FarmType {
  OPEN_FIELD = 'open_field',
  LIVESTOCK = 'livestock',
  ORCHARD = 'orchard',
  GREENHOUSE = 'greenhouse',
}

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'owner_id', type: 'uuid', nullable: true })
  ownerId: string;

  @Column()
  address: string;

  @Column({ type: 'float' })
  lat: number;

  @Column({ type: 'float' })
  lng: number;

  @Column({ name: 'farm_type', type: 'enum', enum: FarmType, nullable: true })
  farmType: FarmType;

  @Column({ type: 'float', nullable: true, comment: '면적(㎡)' })
  area: number;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
