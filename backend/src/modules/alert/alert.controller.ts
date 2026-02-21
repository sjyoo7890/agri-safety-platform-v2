import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { QueryAlertHistoryDto } from './dto/query-alert-history.dto';
import { AcknowledgeAlertDto } from './dto/acknowledge-alert.dto';

@ApiTags('알림')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '알림 생성 및 발송' })
  @ApiResponse({ status: 201, description: '알림 생성 완료' })
  create(@Body() dto: CreateAlertDto) {
    return this.alertService.create(dto);
  }

  @Get('history')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '알림 이력 조회' })
  @ApiResponse({ status: 200, description: '알림 이력 목록' })
  findHistory(@Query() query: QueryAlertHistoryDto) {
    return this.alertService.findHistory(query);
  }

  @Put(':id/acknowledge')
  @Roles('admin', 'farm_manager', 'worker')
  @ApiOperation({ summary: '알림 수신확인' })
  @ApiResponse({ status: 200, description: '수신확인 처리 완료' })
  acknowledge(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AcknowledgeAlertDto,
  ) {
    return this.alertService.acknowledge(id, dto.userId);
  }
}
