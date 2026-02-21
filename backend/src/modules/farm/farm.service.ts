import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from '../../database/entities/farm.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
  ) {}

  async findAll(): Promise<Farm[]> {
    return this.farmRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Farm> {
    const farm = await this.farmRepository.findOne({ where: { id } });
    if (!farm) {
      throw new NotFoundException('농가를 찾을 수 없습니다.');
    }
    return farm;
  }

  async create(dto: CreateFarmDto): Promise<Farm> {
    const farm = this.farmRepository.create(dto);
    return this.farmRepository.save(farm);
  }

  async update(id: string, dto: UpdateFarmDto): Promise<Farm> {
    const farm = await this.findOne(id);
    Object.assign(farm, dto);
    return this.farmRepository.save(farm);
  }

  async remove(id: string): Promise<void> {
    const farm = await this.findOne(id);
    await this.farmRepository.remove(farm);
  }
}
