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
import { SensorService } from './sensor.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { UpdateThresholdDto } from './dto/update-threshold.dto';

@ApiTags('디바이스 - 환경센서')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('devices/sensors')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get()
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '환경센서 목록 조회' })
  @ApiQuery({ name: 'workplaceId', required: false, description: '작업장 ID 필터' })
  @ApiResponse({ status: 200, description: '센서 목록 반환' })
  findAll(@Query('workplaceId') workplaceId?: string) {
    return this.sensorService.findAll(workplaceId);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: '환경센서 등록' })
  @ApiResponse({ status: 201, description: '센서 등록 완료' })
  create(@Body() dto: CreateSensorDto) {
    return this.sensorService.create(dto);
  }

  @Get(':id')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '환경센서 상세 조회' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sensorService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: '환경센서 수정' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSensorDto,
  ) {
    return this.sensorService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: '환경센서 삭제' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sensorService.remove(id);
  }

  @Get(':id/data')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '센서 시계열 데이터 조회' })
  @ApiQuery({ name: 'from', required: true, description: '시작 시간 (ISO 8601)' })
  @ApiQuery({ name: 'to', required: true, description: '종료 시간 (ISO 8601)' })
  getData(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.sensorService.getData(id, new Date(from), new Date(to));
  }

  @Put(':id/threshold')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '센서 임계값 설정' })
  updateThreshold(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateThresholdDto,
  ) {
    return this.sensorService.updateThreshold(id, dto);
  }
}
