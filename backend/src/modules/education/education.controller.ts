import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { QueryProgressDto } from './dto/query-progress.dto';

@ApiTags('교육 이수 현황')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('education')
export class EducationController {
  constructor(private readonly service: EducationService) {}

  @Post('progress')
  @Roles('admin', 'edu_manager')
  @ApiOperation({ summary: '교육 이수 기록 등록' })
  createProgress(@Body() dto: CreateEducationDto) {
    return this.service.createProgress(dto);
  }

  @Get('progress')
  @Roles('admin', 'edu_manager', 'farm_manager')
  @ApiOperation({ summary: '교육 이수 현황 조회 (작업자별 매트릭스)' })
  getProgress(@Query() query: QueryProgressDto) {
    return this.service.getProgress(query);
  }

  @Get('progress/:workerId')
  @Roles('admin', 'edu_manager', 'farm_manager', 'worker')
  @ApiOperation({ summary: '작업자별 교육 이수 현황' })
  getWorkerProgress(@Param('workerId', ParseUUIDPipe) workerId: string) {
    return this.service.getWorkerProgress(workerId);
  }

  @Get('analysis/:workerId')
  @Roles('admin', 'edu_manager', 'farm_manager')
  @ApiOperation({ summary: '교육 성취도 AI 분석 결과' })
  getAnalysis(@Param('workerId', ParseUUIDPipe) workerId: string) {
    return this.service.getAnalysis(workerId);
  }
}
