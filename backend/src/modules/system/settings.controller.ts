import {
  Controller,
  Get,
  Put,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SettingsService } from './settings.service';

class SettingUpdateItem {
  @ApiProperty({ example: 'alert.threshold.warning' })
  @IsString()
  key: string;

  @ApiProperty({ example: '60' })
  @IsString()
  value: string;
}

class UpdateSettingsDto {
  @ApiProperty({ type: [SettingUpdateItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SettingUpdateItem)
  settings: SettingUpdateItem[];
}

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: '시스템 설정 전체 조회' })
  @ApiQuery({ name: 'group', required: false, description: '설정 그룹 필터 (alert, data, system, integration)' })
  @ApiResponse({ status: 200, description: '설정 목록' })
  findAll(@Query('group') group?: string) {
    return this.settingsService.findAll(group);
  }

  @Put()
  @Roles('admin')
  @ApiOperation({ summary: '시스템 설정 일괄 수정' })
  @ApiResponse({ status: 200, description: '수정된 설정 목록' })
  updateMany(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.updateMany(dto.settings);
  }
}
