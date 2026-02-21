import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('audit_logs')
@Index(['userId', 'createdAt'])
@Index(['action', 'createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string;

  @Column({ name: 'user_email', nullable: true })
  userEmail: string;

  @Column({ comment: 'HTTP method + resource (예: POST /api/v1/users)' })
  action: string;

  @Column({ nullable: true, comment: '리소스 타입 (예: users, farms)' })
  resource: string;

  @Column({ name: 'resource_id', nullable: true, comment: '대상 리소스 ID' })
  resourceId: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @Column({ name: 'status_code', type: 'int', nullable: true })
  statusCode: number;

  @Column({ type: 'jsonb', nullable: true, comment: '요청 본문 (민감정보 마스킹)' })
  requestBody: object;

  @Column({ type: 'jsonb', nullable: true, comment: '변경 전/후 데이터' })
  changes: object;

  @Column({ name: 'duration_ms', type: 'int', nullable: true, comment: '응답 시간(ms)' })
  durationMs: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
