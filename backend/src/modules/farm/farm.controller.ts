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
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@ApiTags('Farms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('farms')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Get()
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '농가 목록 조회' })
  @ApiResponse({ status: 200, description: '농가 목록' })
  findAll() {
    return this.farmService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '농가 상세 조회' })
  @ApiResponse({ status: 200, description: '농가 상세 정보' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.farmService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: '농가 등록' })
  @ApiResponse({ status: 201, description: '농가 등록 성공' })
  create(@Body() dto: CreateFarmDto) {
    return this.farmService.create(dto);
  }

  @Put(':id')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '농가 수정' })
  @ApiResponse({ status: 200, description: '농가 수정 성공' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFarmDto,
  ) {
    return this.farmService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: '농가 삭제' })
  @ApiResponse({ status: 200, description: '농가 삭제 성공' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.farmService.remove(id);
  }
}
