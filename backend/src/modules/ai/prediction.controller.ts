import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PredictionService } from './prediction.service';
import { QueryPredictionsDto, QueryRiskHistoryDto } from './dto/query-predictions.dto';

@ApiTags('AI 사고 예측')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('predictions')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Get('realtime')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '6대 사고유형 실시간 예측 결과' })
  @ApiResponse({ status: 200, description: '실시간 예측 결과 목록' })
  getRealtimePredictions(@Query() query: QueryPredictionsDto) {
    return this.predictionService.getRealtimePredictions(query.farmId, query.workerId);
  }

  @Get('models/performance')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: 'AI 모델 성능 지표' })
  @ApiResponse({ status: 200, description: '모델별 성능 지표' })
  getModelPerformance() {
    return this.predictionService.getModelPerformance();
  }

  @Get(':id/xai')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: 'XAI 분석 결과 (SHAP/LIME 기여요인)' })
  @ApiResponse({ status: 200, description: 'XAI 분석 결과' })
  getXaiResult(@Param('id', ParseUUIDPipe) id: string) {
    return this.predictionService.getXaiResult(id);
  }

  @Post(':id/false-alarm')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '오경보 마킹/피드백' })
  @ApiResponse({ status: 200, description: '오경보 마킹 완료' })
  markFalseAlarm(@Param('id', ParseUUIDPipe) id: string) {
    return this.predictionService.markFalseAlarm(id);
  }
}

@ApiTags('동적 위험성평가')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('risk-assessment')
export class RiskAssessmentController {
  constructor(private readonly predictionService: PredictionService) {}

  @Get('current')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '현재 동적 위험성평가 결과' })
  @ApiQuery({ name: 'farmId', required: false })
  @ApiResponse({ status: 200, description: '현재 위험성평가' })
  getCurrentAssessment(@Query('farmId') farmId?: string) {
    return this.predictionService.getCurrentRiskAssessment(farmId);
  }

  @Get('history')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '위험성평가 이력 조회' })
  @ApiResponse({ status: 200, description: '위험성평가 이력' })
  getRiskHistory(@Query() query: QueryRiskHistoryDto) {
    return this.predictionService.getRiskHistory(query.farmId, query.workplaceId, query.from, query.to);
  }

  @Get('hazards')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '위험요인 추천 목록' })
  @ApiQuery({ name: 'farmId', required: false })
  @ApiResponse({ status: 200, description: '위험요인 목록' })
  getHazards(@Query('farmId') farmId?: string) {
    return this.predictionService.getHazards(farmId);
  }

  @Get('countermeasures')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '감소대책 목록' })
  @ApiQuery({ name: 'farmId', required: false })
  @ApiResponse({ status: 200, description: '감소대책 목록' })
  getCountermeasures(@Query('farmId') farmId?: string) {
    return this.predictionService.getCountermeasures(farmId);
  }
}
