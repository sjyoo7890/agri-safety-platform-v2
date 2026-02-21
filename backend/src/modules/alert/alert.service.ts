import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Alert, AlertStatus } from '../../database/entities/alert.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { QueryAlertHistoryDto } from './dto/query-alert-history.dto';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {}

  /** 알림 생성 및 발송 */
  async create(dto: CreateAlertDto): Promise<Alert> {
    const alert = this.alertRepository.create(dto);
    return this.alertRepository.save(alert);
  }

  /** 알림 이력 조회 (필터) */
  async findHistory(query: QueryAlertHistoryDto): Promise<Alert[]> {
    const where: FindOptionsWhere<Alert> = {};

    if (query.farmId) where.farmId = query.farmId;
    if (query.type) where.type = query.type;
    if (query.severity) where.severity = query.severity;
    if (query.status) where.status = query.status;
    if (query.from && query.to) {
      where.createdAt = Between(new Date(query.from), new Date(query.to));
    }

    return this.alertRepository.find({
      where,
      relations: ['farm', 'worker'],
      order: { createdAt: 'DESC' },
    });
  }

  /** 알림 수신확인 */
  async acknowledge(id: string, userId: string): Promise<Alert> {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) throw new NotFoundException('알림을 찾을 수 없습니다.');

    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.acknowledgedBy = userId;
    alert.acknowledgedAt = new Date();
    return this.alertRepository.save(alert);
  }
}
