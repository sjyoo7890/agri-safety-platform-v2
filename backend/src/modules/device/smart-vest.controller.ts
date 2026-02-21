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
import { SmartVestService } from './smart-vest.service';
import { CreateSmartVestDto } from './dto/create-smart-vest.dto';
import { UpdateSmartVestDto } from './dto/update-smart-vest.dto';
import { AssignVestDto } from './dto/assign-vest.dto';

@ApiTags('디바이스 - 스마트 조끼')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('devices/vests')
export class SmartVestController {
  constructor(private readonly smartVestService: SmartVestService) {}

  @Get()
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '스마트 조끼 목록 조회' })
  @ApiQuery({ name: 'farmId', required: false, description: '농가 ID 필터' })
  @ApiResponse({ status: 200, description: '조끼 목록 반환' })
  findAll(@Query('farmId') farmId?: string) {
    return this.smartVestService.findAll(farmId);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: '스마트 조끼 등록' })
  @ApiResponse({ status: 201, description: '조끼 등록 완료' })
  create(@Body() dto: CreateSmartVestDto) {
    return this.smartVestService.create(dto);
  }

  @Get(':id')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '스마트 조끼 상세 조회' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.smartVestService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: '스마트 조끼 수정' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSmartVestDto,
  ) {
    return this.smartVestService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: '스마트 조끼 삭제' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.smartVestService.remove(id);
  }

  @Get(':id/status')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '스마트 조끼 실시간 상태 조회' })
  getStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.smartVestService.getStatus(id);
  }

  @Post(':id/assign')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '작업자 배정/회수' })
  assignWorker(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignVestDto,
  ) {
    return this.smartVestService.assignWorker(id, dto.workerId ?? null);
  }
}
