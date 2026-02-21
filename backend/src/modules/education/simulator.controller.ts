import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SimulatorService } from './simulator.service';

@ApiTags('시뮬레이터')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('education/simulators')
export class SimulatorController {
  constructor(private readonly service: SimulatorService) {}

  @Get()
  @Roles('admin', 'edu_manager', 'farm_manager')
  @ApiOperation({ summary: '시뮬레이터 상태 모니터링' })
  findAll() {
    return this.service.findAll();
  }
}
