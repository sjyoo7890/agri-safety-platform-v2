import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ReportService } from './report.service';
import { QueryStatisticsDto } from './dto/query-statistics.dto';

@ApiTags('분석 리포트')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('statistics')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '통계 데이터 조회 (차트용)' })
  @ApiResponse({ status: 200, description: '통계 데이터' })
  getStatistics(@Query() query: QueryStatisticsDto) {
    return this.reportService.getStatistics(query.from, query.to, query.farmId);
  }

  @Get('ai-performance')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: 'AI 모델 성능 리포트 데이터' })
  @ApiResponse({ status: 200, description: 'AI 성능 리포트' })
  getAiPerformance() {
    return this.reportService.getFalseAlarmTrend();
  }
}

@ApiTags('작업자 안전 기록부')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('workers')
export class WorkerSafetyRecordController {
  constructor(private readonly reportService: ReportService) {}

  @Get(':id/safety-record')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '작업자 안전 기록부' })
  @ApiResponse({ status: 200, description: '작업자 안전 기록' })
  getSafetyRecord(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportService.getWorkerSafetyRecord(id);
  }
}
