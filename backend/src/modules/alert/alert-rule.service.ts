import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertRule } from '../../database/entities/alert-rule.entity';
import { AlertRecipient } from '../../database/entities/alert-recipient.entity';
import { EscalationRule } from '../../database/entities/escalation-rule.entity';
import { UpsertAlertRuleDto } from './dto/upsert-alert-rule.dto';
import { UpsertRecipientDto } from './dto/upsert-recipient.dto';
import { UpsertEscalationRuleDto } from './dto/upsert-escalation-rule.dto';

@Injectable()
export class AlertRuleService {
  constructor(
    @InjectRepository(AlertRule)
    private readonly ruleRepository: Repository<AlertRule>,
    @InjectRepository(AlertRecipient)
    private readonly recipientRepository: Repository<AlertRecipient>,
    @InjectRepository(EscalationRule)
    private readonly escalationRepository: Repository<EscalationRule>,
  ) {}

  // ── 알림 규칙 ──

  async findRules(farmId?: string): Promise<AlertRule[]> {
    const where = farmId ? { farmId } : {};
    return this.ruleRepository.find({ where, order: { severity: 'ASC' } });
  }

  async upsertRules(dto: UpsertAlertRuleDto): Promise<AlertRule[]> {
    const results: AlertRule[] = [];
    for (const item of dto.rules) {
      if (item.id) {
        const existing = await this.ruleRepository.findOne({ where: { id: item.id } });
        if (!existing) throw new NotFoundException(`알림 규칙 ${item.id}을 찾을 수 없습니다.`);
        Object.assign(existing, { severity: item.severity, channels: item.channels, isActive: item.isActive ?? true });
        results.push(await this.ruleRepository.save(existing));
      } else {
        const rule = this.ruleRepository.create({
          farmId: dto.farmId,
          severity: item.severity,
          channels: item.channels,
          isActive: item.isActive ?? true,
        });
        results.push(await this.ruleRepository.save(rule));
      }
    }
    return results;
  }

  // ── 수신자 그룹 ──

  async findRecipients(farmId?: string): Promise<AlertRecipient[]> {
    const where = farmId ? { farmId } : {};
    return this.recipientRepository.find({ where, order: { createdAt: 'DESC' } });
  }

  async createRecipient(dto: UpsertRecipientDto): Promise<AlertRecipient> {
    const recipient = this.recipientRepository.create(dto);
    return this.recipientRepository.save(recipient);
  }

  async updateRecipient(id: string, dto: UpsertRecipientDto): Promise<AlertRecipient> {
    const recipient = await this.recipientRepository.findOne({ where: { id } });
    if (!recipient) throw new NotFoundException('수신자 그룹을 찾을 수 없습니다.');
    Object.assign(recipient, dto);
    return this.recipientRepository.save(recipient);
  }

  async removeRecipient(id: string): Promise<void> {
    const recipient = await this.recipientRepository.findOne({ where: { id } });
    if (!recipient) throw new NotFoundException('수신자 그룹을 찾을 수 없습니다.');
    await this.recipientRepository.remove(recipient);
  }

  // ── 에스컬레이션 규칙 ──

  async findEscalationRules(farmId?: string): Promise<EscalationRule[]> {
    const where = farmId ? { farmId } : {};
    return this.escalationRepository.find({ where, order: { severity: 'ASC', step: 'ASC' } });
  }

  async upsertEscalationRules(dto: UpsertEscalationRuleDto): Promise<EscalationRule[]> {
    const results: EscalationRule[] = [];
    for (const item of dto.rules) {
      if (item.id) {
        const existing = await this.escalationRepository.findOne({ where: { id: item.id } });
        if (!existing) throw new NotFoundException(`에스컬레이션 규칙 ${item.id}을 찾을 수 없습니다.`);
        Object.assign(existing, {
          severity: item.severity,
          step: item.step,
          waitMinutes: item.waitMinutes,
          targetType: item.targetType,
          targetUserIds: item.targetUserIds,
          isActive: item.isActive ?? true,
        });
        results.push(await this.escalationRepository.save(existing));
      } else {
        const rule = this.escalationRepository.create({
          farmId: dto.farmId,
          severity: item.severity,
          step: item.step,
          waitMinutes: item.waitMinutes,
          targetType: item.targetType,
          targetUserIds: item.targetUserIds,
          isActive: item.isActive ?? true,
        });
        results.push(await this.escalationRepository.save(rule));
      }
    }
    return results;
  }
}
