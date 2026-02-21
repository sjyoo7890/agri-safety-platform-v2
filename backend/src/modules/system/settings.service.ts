import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSetting } from '../../database/entities/system-setting.entity';

/** 기본 설정값 (최초 기동 시 삽입) */
const DEFAULT_SETTINGS: Partial<SystemSetting>[] = [
  { key: 'alert.threshold.caution', value: '26', group: 'alert', valueType: 'number', description: '주의 등급 임계값' },
  { key: 'alert.threshold.warning', value: '51', group: 'alert', valueType: 'number', description: '경고 등급 임계값' },
  { key: 'alert.threshold.danger', value: '76', group: 'alert', valueType: 'number', description: '위험 등급 임계값' },
  { key: 'data.retention.sensor_days', value: '90', group: 'data', valueType: 'number', description: '센서 원본 데이터 보존 일수' },
  { key: 'data.retention.alert_days', value: '365', group: 'data', valueType: 'number', description: '알림 보존 일수' },
  { key: 'data.retention.audit_days', value: '90', group: 'data', valueType: 'number', description: '감사 로그 보존 일수' },
  { key: 'system.timezone', value: 'Asia/Seoul', group: 'system', valueType: 'string', description: '시스템 시간대' },
  { key: 'system.language', value: 'ko', group: 'system', valueType: 'string', description: '시스템 언어' },
  { key: 'integration.safety365.enabled', value: 'false', group: 'integration', valueType: 'boolean', description: '농업인안전365 연계 활성화' },
  { key: 'integration.safety365.api_url', value: '', group: 'integration', valueType: 'string', description: '농업인안전365 API URL' },
  { key: 'integration.safety365.api_key', value: '', group: 'integration', valueType: 'string', description: '농업인안전365 API 키' },
];

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(SystemSetting)
    private readonly settingRepository: Repository<SystemSetting>,
  ) {}

  /** 애플리케이션 시작 시 기본 설정 삽입 */
  async onModuleInit() {
    for (const setting of DEFAULT_SETTINGS) {
      const exists = await this.settingRepository.findOne({
        where: { key: setting.key },
      });
      if (!exists) {
        await this.settingRepository.save(
          this.settingRepository.create(setting),
        );
      }
    }
  }

  /** 전체 설정 조회 (그룹별 정렬) */
  async findAll(group?: string): Promise<SystemSetting[]> {
    const where = group ? { group } : {};
    return this.settingRepository.find({
      where,
      order: { group: 'ASC', key: 'ASC' },
    });
  }

  /** 단일 설정값 조회 */
  async getValue(key: string): Promise<string | null> {
    const setting = await this.settingRepository.findOne({ where: { key } });
    return setting?.value ?? null;
  }

  /** 설정값 일괄 업데이트 */
  async updateMany(
    updates: { key: string; value: string }[],
  ): Promise<SystemSetting[]> {
    const results: SystemSetting[] = [];

    for (const update of updates) {
      let setting = await this.settingRepository.findOne({
        where: { key: update.key },
      });
      if (setting) {
        setting.value = update.value;
        results.push(await this.settingRepository.save(setting));
      }
    }

    return results;
  }
}
