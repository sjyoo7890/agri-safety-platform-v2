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
import { WorkerService } from './worker.service';
import { QueryVitalsDto } from './dto/query-vitals.dto';

@ApiTags('작업자 상세 모니터링')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('workers')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Get(':id/status')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '작업자 실시간 상태 (생체신호, 위치, 위험등급)' })
  @ApiResponse({ status: 200, description: '작업자 상태 데이터' })
  getStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.workerService.getStatus(id);
  }

  @Get(':id/vitals')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '기간별 생체신호 이력 (차트 데이터)' })
  @ApiResponse({ status: 200, description: '생체신호 시계열 데이터' })
  getVitals(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: QueryVitalsDto,
  ) {
    return this.workerService.getVitals(id, query.from, query.to);
  }

  @Get(':id/posture')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '현재 자세/동작 상태' })
  @ApiResponse({ status: 200, description: '자세 상태 데이터' })
  getPosture(@Param('id', ParseUUIDPipe) id: string) {
    return this.workerService.getPosture(id);
  }

  @Get(':id/timeline')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '작업자 활동 타임라인' })
  @ApiResponse({ status: 200, description: '활동 타임라인' })
  getTimeline(@Param('id', ParseUUIDPipe) id: string) {
    return this.workerService.getTimeline(id);
  }

  @Get(':id/acclimatization')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '열 순응도 분석 결과' })
  @ApiResponse({ status: 200, description: '열 순응도 분석' })
  getAcclimatization(@Param('id', ParseUUIDPipe) id: string) {
    return this.workerService.getAcclimatization(id);
  }
}
