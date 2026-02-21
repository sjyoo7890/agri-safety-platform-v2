import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartVest } from '../../database/entities/smart-vest.entity';
import { CreateSmartVestDto } from './dto/create-smart-vest.dto';
import { UpdateSmartVestDto } from './dto/update-smart-vest.dto';

@Injectable()
export class SmartVestService {
  constructor(
    @InjectRepository(SmartVest)
    private readonly vestRepository: Repository<SmartVest>,
  ) {}

  async findAll(farmId?: string): Promise<SmartVest[]> {
    const where = farmId ? { farmId } : {};
    return this.vestRepository.find({
      where,
      relations: ['worker', 'farm'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<SmartVest> {
    const vest = await this.vestRepository.findOne({
      where: { id },
      relations: ['worker', 'farm'],
    });
    if (!vest) throw new NotFoundException('스마트 조끼를 찾을 수 없습니다.');
    return vest;
  }

  async create(dto: CreateSmartVestDto): Promise<SmartVest> {
    const vest = this.vestRepository.create(dto);
    return this.vestRepository.save(vest);
  }

  async update(id: string, dto: UpdateSmartVestDto): Promise<SmartVest> {
    const vest = await this.findOne(id);
    Object.assign(vest, dto);
    return this.vestRepository.save(vest);
  }

  async remove(id: string): Promise<void> {
    const vest = await this.findOne(id);
    await this.vestRepository.remove(vest);
  }

  async getStatus(id: string): Promise<Pick<SmartVest, 'id' | 'batteryLevel' | 'commStatus' | 'lastHeartbeat'>> {
    const vest = await this.findOne(id);
    return {
      id: vest.id,
      batteryLevel: vest.batteryLevel,
      commStatus: vest.commStatus,
      lastHeartbeat: vest.lastHeartbeat,
    };
  }

  async assignWorker(id: string, workerId: string | null): Promise<SmartVest> {
    const vest = await this.findOne(id);
    (vest as any).workerId = workerId;
    return this.vestRepository.save(vest);
  }
}
