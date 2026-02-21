import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farm } from './farm.entity';

export enum UserRole {
  ADMIN = 'admin',
  FARM_MANAGER = 'farm_manager',
  GOVT_MANAGER = 'govt_manager',
  EDU_MANAGER = 'edu_manager',
  WORKER = 'worker',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.WORKER })
  role: UserRole;

  @Column({ nullable: true })
  phone: string;

  @ManyToOne(() => Farm, { nullable: true })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @Column({ name: 'farm_id', type: 'uuid', nullable: true })
  farmId: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
