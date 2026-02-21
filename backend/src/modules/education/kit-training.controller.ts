import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { KitTrainingService } from './kit-training.service';
import { CreateKitTrainingDto } from './dto/create-kit-training.dto';

@ApiTags('응급키트 실습')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('education/kit-training')
export class KitTrainingController {
  constructor(private readonly service: KitTrainingService) {}

  @Post()
  @Roles('admin', 'edu_manager')
  @ApiOperation({ summary: '응급키트 실습 기록 등록' })
  create(@Body() dto: CreateKitTrainingDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('admin', 'edu_manager', 'farm_manager')
  @ApiOperation({ summary: '응급키트 실습 기록 조회' })
  findAll() {
    return this.service.findAll();
  }
}
