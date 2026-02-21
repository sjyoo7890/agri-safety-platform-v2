import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIPrediction } from '../../database/entities/ai-prediction.entity';
import { RiskAssessment } from '../../database/entities/risk-assessment.entity';
import { PredictionController, RiskAssessmentController } from './prediction.controller';
import { PredictionService } from './prediction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AIPrediction, RiskAssessment]),
  ],
  controllers: [PredictionController, RiskAssessmentController],
  providers: [PredictionService],
  exports: [PredictionService],
})
export class AIModule {}
