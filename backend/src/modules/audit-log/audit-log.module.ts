import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../../database/entities/audit-log.entity';
import { AuditLogController } from './audit-log.controller';
import { AuditLogService } from './audit-log.service';
import { AuditLogInterceptor } from '../../common/interceptors/audit-log.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditLogController],
  providers: [AuditLogService, AuditLogInterceptor],
  exports: [AuditLogInterceptor, TypeOrmModule],
})
export class AuditLogModule {}
