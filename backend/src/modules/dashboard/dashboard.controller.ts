import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '대시보드 통합 요약 (위험현황, 작업자수, 알림수, 장비현황)' })
  @ApiQuery({ name: 'farmId', required: false, description: '농장 ID 필터' })
  @ApiResponse({ status: 200, description: '대시보드 요약 데이터' })
  getOverview(@Query('farmId') farmId?: string) {
    return this.dashboardService.getOverview(farmId);
  }

  @Get('map')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: 'GIS 지도 데이터 (작업자/센서/작업장 위치 및 상태)' })
  @ApiQuery({ name: 'farmId', required: false, description: '농장 ID 필터' })
  @ApiResponse({ status: 200, description: 'GIS 지도 마커 데이터' })
  getMapData(@Query('farmId') farmId?: string) {
    return this.dashboardService.getMapData(farmId);
  }
}
