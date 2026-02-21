import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ApiKeyStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
}

@Entity('api_keys')
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'key_hash', unique: true, comment: 'SHA256 해시된 API 키' })
  keyHash: string;

  @Column({ name: 'key_prefix', length: 12, comment: '키 접두사 (표시용, 예: agri_sk_xxxx)' })
  keyPrefix: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ApiKeyStatus, default: ApiKeyStatus.ACTIVE })
  status: ApiKeyStatus;

  @Column({ type: 'simple-array', nullable: true, comment: '허용 IP 목록' })
  allowedIps: string[];

  @Column({ name: 'rate_limit', type: 'int', default: 1000, comment: '시간당 요청 제한' })
  rateLimit: number;

  @Column({ name: 'total_requests', type: 'bigint', default: 0 })
  totalRequests: number;

  @Column({ name: 'last_used_at', type: 'timestamp', nullable: true })
  lastUsedAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
