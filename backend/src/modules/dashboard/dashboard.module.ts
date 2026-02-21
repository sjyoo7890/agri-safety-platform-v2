import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardGateway } from './dashboard.gateway';
import { Worker } from '../../database/entities/worker.entity';
import { SmartVest } from '../../database/entities/smart-vest.entity';
import { Sensor } from '../../database/entities/sensor.entity';
import { Alert } from '../../database/entities/alert.entity';
import { Workplace } from '../../database/entities/workplace.entity';
import { Farm } from '../../database/entities/farm.entity';
import { RiskAssessment } from '../../database/entities/risk-assessment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Worker,
      SmartVest,
      Sensor,
      Alert,
      Workplace,
      Farm,
      RiskAssessment,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardGateway],
  exports: [DashboardGateway],
})
export class DashboardModule {}
