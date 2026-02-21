import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EduContent, Education, EduSchedule, Simulator, KitTraining } from '../../database/entities';
import { EduContentController } from './edu-content.controller';
import { EduContentService } from './edu-content.service';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { SimulatorController } from './simulator.controller';
import { SimulatorService } from './simulator.service';
import { KitTrainingController } from './kit-training.controller';
import { KitTrainingService } from './kit-training.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EduContent, Education, EduSchedule, Simulator, KitTraining]),
  ],
  controllers: [
    EduContentController,
    EducationController,
    ScheduleController,
    SimulatorController,
    KitTrainingController,
  ],
  providers: [
    EduContentService,
    EducationService,
    ScheduleService,
    SimulatorService,
    KitTrainingService,
  ],
  exports: [EduContentService, EducationService, ScheduleService, SimulatorService, KitTrainingService],
})
export class EducationModule {}
