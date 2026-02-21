import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './database/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { FarmModule } from './modules/farm/farm.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { SystemModule } from './modules/system/system.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DeviceModule } from './modules/device/device.module';
import { AlertModule } from './modules/alert/alert.module';
import { WorkerModule } from './modules/worker/worker.module';
import { AIModule } from './modules/ai/ai.module';
import { ReportModule } from './modules/report/report.module';
import { EducationModule } from './modules/education/education.module';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    RedisModule,
    AuthModule,
    UserModule,
    FarmModule,
    AuditLogModule,
    SystemModule,
    DashboardModule,
    DeviceModule,
    AlertModule,
    WorkerModule,
    AIModule,
    ReportModule,
    EducationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useExisting: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}
