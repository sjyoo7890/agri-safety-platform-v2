import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from '../../database/entities/worker.entity';
import { SmartVest } from '../../database/entities/smart-vest.entity';
import { SensorData } from '../../database/entities/sensor-data.entity';
import { Alert } from '../../database/entities/alert.entity';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Worker, SmartVest, SensorData, Alert]),
  ],
  controllers: [WorkerController],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
