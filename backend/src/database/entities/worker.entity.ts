import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Farm } from './farm.entity';

export enum Gender {
  M = 'M',
  F = 'F',
}

export enum AcclimatizationLevel {
  A = 'A',
  B = 'B',
  C = 'C',
}

@Entity('workers')
export class Worker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @ManyToOne(() => Farm, { nullable: false })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @Column({ name: 'farm_id', type: 'uuid' })
  farmId: string;

  @Column({ nullable: true })
  age: number;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'float', nullable: true })
  bmi: number;

  @Column({
    name: 'acclimatization_level',
    type: 'enum',
    enum: AcclimatizationLevel,
    nullable: true,
    comment: '완전순응(A)/부분순응(B)/미순응(C)',
  })
  acclimatizationLevel: AcclimatizationLevel;

  @Column({ name: 'emergency_contact', nullable: true, comment: '보호자 연락처' })
  emergencyContact: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
