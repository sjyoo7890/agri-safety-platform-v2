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
import { AssetService } from './asset.service';

@ApiTags('Assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '전체 장비 자산 대장 조회' })
  @ApiQuery({ name: 'farmId', required: false, description: '농장 ID 필터' })
  @ApiResponse({ status: 200, description: '장비 자산 목록 (스마트조끼, 응급키트, 환경센서)' })
  getAssetList(@Query('farmId') farmId?: string) {
    return this.assetService.getAssetList(farmId);
  }

  @Get('summary')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '장비 자산 요약 (상태별 카운트)' })
  @ApiQuery({ name: 'farmId', required: false, description: '농장 ID 필터' })
  @ApiResponse({ status: 200, description: '장비 상태 요약' })
  getSummary(@Query('farmId') farmId?: string) {
    return this.assetService.getSummary(farmId);
  }
}
