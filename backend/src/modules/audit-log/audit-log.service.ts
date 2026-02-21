import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { AuditLog } from '../../database/entities/audit-log.entity';

export interface AuditLogQuery {
  userId?: string;
  action?: string;
  resource?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async findAll(query: AuditLogQuery) {
    const {
      userId,
      action,
      resource,
      from,
      to,
      page = 1,
      limit = 20,
    } = query;

    const where: FindOptionsWhere<AuditLog> = {};

    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (resource) where.resource = resource;
    if (from && to) {
      where.createdAt = Between(new Date(from), new Date(to));
    }

    const [data, total] = await this.auditLogRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
