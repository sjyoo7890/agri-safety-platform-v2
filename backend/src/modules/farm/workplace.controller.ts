import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { WorkplaceService } from './workplace.service';
import { CreateWorkplaceDto } from './dto/create-workplace.dto';
import { UpdateWorkplaceDto } from './dto/update-workplace.dto';

@ApiTags('Workplaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('farms/:farmId/workplaces')
export class WorkplaceController {
  constructor(private readonly workplaceService: WorkplaceService) {}

  @Get()
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '농작업장 목록 조회' })
  @ApiResponse({ status: 200, description: '농작업장 목록' })
  findAll(@Param('farmId', ParseUUIDPipe) farmId: string) {
    return this.workplaceService.findAllByFarm(farmId);
  }

  @Get(':id')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '농작업장 상세 조회' })
  @ApiResponse({ status: 200, description: '농작업장 상세 정보' })
  findOne(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.workplaceService.findOne(farmId, id);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: '농작업장 등록' })
  @ApiResponse({ status: 201, description: '농작업장 등록 성공' })
  create(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Body() dto: CreateWorkplaceDto,
  ) {
    return this.workplaceService.create(farmId, dto);
  }

  @Put(':id')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '농작업장 수정' })
  @ApiResponse({ status: 200, description: '농작업장 수정 성공' })
  update(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWorkplaceDto,
  ) {
    return this.workplaceService.update(farmId, id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: '농작업장 삭제' })
  @ApiResponse({ status: 200, description: '농작업장 삭제 성공' })
  remove(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.workplaceService.remove(farmId, id);
  }
}
