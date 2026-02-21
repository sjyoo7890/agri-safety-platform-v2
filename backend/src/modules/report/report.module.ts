import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accident } from '../../database/entities/accident.entity';
import { AIPrediction } from '../../database/entities/ai-prediction.entity';
import { Alert } from '../../database/entities/alert.entity';
import { Worker } from '../../database/entities/worker.entity';
import { AccidentController } from './accident.controller';
import { AccidentService } from './accident.service';
import { ReportController, WorkerSafetyRecordController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accident, AIPrediction, Alert, Worker]),
  ],
  controllers: [AccidentController, ReportController, WorkerSafetyRecordController],
  providers: [AccidentService, ReportService],
  exports: [AccidentService, ReportService],
})
export class ReportModule {}
