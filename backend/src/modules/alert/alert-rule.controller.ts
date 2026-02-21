import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AlertRuleService } from './alert-rule.service';
import { UpsertAlertRuleDto } from './dto/upsert-alert-rule.dto';
import { UpsertRecipientDto } from './dto/upsert-recipient.dto';
import { UpsertEscalationRuleDto } from './dto/upsert-escalation-rule.dto';

@ApiTags('알림 규칙')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('alerts')
export class AlertRuleController {
  constructor(private readonly alertRuleService: AlertRuleService) {}

  // ── 알림 규칙 (채널 매핑) ──

  @Get('rules')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '알림 규칙 조회' })
  @ApiQuery({ name: 'farmId', required: false })
  @ApiResponse({ status: 200, description: '알림 규칙 목록' })
  findRules(@Query('farmId') farmId?: string) {
    return this.alertRuleService.findRules(farmId);
  }

  @Put('rules')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '알림 규칙 수정 (배열 upsert)' })
  @ApiResponse({ status: 200, description: '알림 규칙 수정 완료' })
  upsertRules(@Body() dto: UpsertAlertRuleDto) {
    return this.alertRuleService.upsertRules(dto);
  }

  // ── 수신자 그룹 ──

  @Get('recipients')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '수신자 그룹 목록 조회' })
  @ApiQuery({ name: 'farmId', required: false })
  @ApiResponse({ status: 200, description: '수신자 그룹 목록' })
  findRecipients(@Query('farmId') farmId?: string) {
    return this.alertRuleService.findRecipients(farmId);
  }

  @Post('recipients')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '수신자 그룹 생성' })
  @ApiResponse({ status: 201, description: '수신자 그룹 생성 완료' })
  createRecipient(@Body() dto: UpsertRecipientDto) {
    return this.alertRuleService.createRecipient(dto);
  }

  @Put('recipients/:id')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '수신자 그룹 수정' })
  updateRecipient(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpsertRecipientDto,
  ) {
    return this.alertRuleService.updateRecipient(id, dto);
  }

  @Delete('recipients/:id')
  @Roles('admin')
  @ApiOperation({ summary: '수신자 그룹 삭제' })
  removeRecipient(@Param('id', ParseUUIDPipe) id: string) {
    return this.alertRuleService.removeRecipient(id);
  }

  // ── 에스컬레이션 규칙 ──

  @Get('escalation')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '에스컬레이션 규칙 조회' })
  @ApiQuery({ name: 'farmId', required: false })
  @ApiResponse({ status: 200, description: '에스컬레이션 규칙 목록' })
  findEscalationRules(@Query('farmId') farmId?: string) {
    return this.alertRuleService.findEscalationRules(farmId);
  }

  @Put('escalation')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '에스컬레이션 규칙 수정 (배열 upsert)' })
  @ApiResponse({ status: 200, description: '에스컬레이션 규칙 수정 완료' })
  upsertEscalationRules(@Body() dto: UpsertEscalationRuleDto) {
    return this.alertRuleService.upsertEscalationRules(dto);
  }
}
