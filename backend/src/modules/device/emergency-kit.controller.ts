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
import { EmergencyKitService } from './emergency-kit.service';
import { CreateEmergencyKitDto } from './dto/create-emergency-kit.dto';
import { UpdateEmergencyKitDto } from './dto/update-emergency-kit.dto';

@ApiTags('디바이스 - 응급키트')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('devices/kits')
export class EmergencyKitController {
  constructor(private readonly emergencyKitService: EmergencyKitService) {}

  @Get()
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '응급키트 목록 조회' })
  @ApiQuery({ name: 'farmId', required: false, description: '농가 ID 필터' })
  @ApiResponse({ status: 200, description: '응급키트 목록 반환' })
  findAll(@Query('farmId') farmId?: string) {
    return this.emergencyKitService.findAll(farmId);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: '응급키트 등록' })
  @ApiResponse({ status: 201, description: '응급키트 등록 완료' })
  create(@Body() dto: CreateEmergencyKitDto) {
    return this.emergencyKitService.create(dto);
  }

  @Get(':id')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '응급키트 상세 조회' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.emergencyKitService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: '응급키트 수정' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEmergencyKitDto,
  ) {
    return this.emergencyKitService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: '응급키트 삭제' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.emergencyKitService.remove(id);
  }

  @Get(':id/events')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '응급키트 개폐 이벤트 로그 조회' })
  getEvents(@Param('id', ParseUUIDPipe) id: string) {
    return this.emergencyKitService.getEvents(id);
  }
}
