import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workplace } from '../../database/entities/workplace.entity';
import { CreateWorkplaceDto } from './dto/create-workplace.dto';
import { UpdateWorkplaceDto } from './dto/update-workplace.dto';

@Injectable()
export class WorkplaceService {
  constructor(
    @InjectRepository(Workplace)
    private readonly workplaceRepository: Repository<Workplace>,
  ) {}

  async findAllByFarm(farmId: string): Promise<Workplace[]> {
    return this.workplaceRepository.find({
      where: { farmId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(farmId: string, id: string): Promise<Workplace> {
    const workplace = await this.workplaceRepository.findOne({
      where: { id, farmId },
    });
    if (!workplace) {
      throw new NotFoundException('농작업장을 찾을 수 없습니다.');
    }
    return workplace;
  }

  async create(farmId: string, dto: CreateWorkplaceDto): Promise<Workplace> {
    const workplace = this.workplaceRepository.create({
      ...dto,
      farmId,
    });
    return this.workplaceRepository.save(workplace);
  }

  async update(
    farmId: string,
    id: string,
    dto: UpdateWorkplaceDto,
  ): Promise<Workplace> {
    const workplace = await this.findOne(farmId, id);
    Object.assign(workplace, dto);
    return this.workplaceRepository.save(workplace);
  }

  async remove(farmId: string, id: string): Promise<void> {
    const workplace = await this.findOne(farmId, id);
    await this.workplaceRepository.remove(workplace);
  }
}
