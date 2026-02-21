import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 시스템 글로벌 설정 (키-값 구조)
 * 기본 키 목록:
 * - alert.threshold.caution: 주의 임계값 (기본 26)
 * - alert.threshold.warning: 경고 임계값 (기본 51)
 * - alert.threshold.danger: 위험 임계값 (기본 76)
 * - data.retention.sensor_days: 센서 원본 보존 일수 (기본 90)
 * - data.retention.alert_days: 알림 보존 일수 (기본 365)
 * - data.retention.audit_days: 감사 로그 보존 일수 (기본 90)
 * - system.timezone: 시간대 (기본 Asia/Seoul)
 * - system.language: 언어 (기본 ko)
 * - integration.safety365.enabled: 농업인안전365 연계 활성화
 * - integration.safety365.api_url: 농업인안전365 API URL
 * - integration.safety365.api_key: 농업인안전365 API 키
 */
@Entity('system_settings')
export class SystemSetting {
  @PrimaryColumn({ comment: '설정 키 (dot notation)' })
  key: string;

  @Column({ type: 'text', comment: '설정 값 (JSON 문자열 가능)' })
  value: string;

  @Column({ type: 'text', nullable: true, comment: '설정 설명' })
  description: string;

  @Column({ nullable: true, comment: '설정 그룹 (alert, data, system, integration)' })
  group: string;

  @Column({ name: 'value_type', default: 'string', comment: 'string | number | boolean | json' })
  valueType: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
