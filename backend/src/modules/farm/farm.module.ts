import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';
import { WorkplaceController } from './workplace.controller';
import { WorkplaceService } from './workplace.service';
import { Farm } from '../../database/entities/farm.entity';
import { Workplace } from '../../database/entities/workplace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farm, Workplace])],
  controllers: [FarmController, WorkplaceController],
  providers: [FarmService, WorkplaceService],
  exports: [FarmService, WorkplaceService],
})
export class FarmModule {}
