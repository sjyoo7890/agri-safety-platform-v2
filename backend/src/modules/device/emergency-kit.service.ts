import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmergencyKit } from '../../database/entities/emergency-kit.entity';
import { Alert } from '../../database/entities/alert.entity';
import { CreateEmergencyKitDto } from './dto/create-emergency-kit.dto';
import { UpdateEmergencyKitDto } from './dto/update-emergency-kit.dto';

@Injectable()
export class EmergencyKitService {
  constructor(
    @InjectRepository(EmergencyKit)
    private readonly kitRepository: Repository<EmergencyKit>,
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {}

  async findAll(farmId?: string): Promise<EmergencyKit[]> {
    const where = farmId ? { farmId } : {};
    return this.kitRepository.find({
      where,
      relations: ['farm', 'workplace'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<EmergencyKit> {
    const kit = await this.kitRepository.findOne({
      where: { id },
      relations: ['farm', 'workplace'],
    });
    if (!kit) throw new NotFoundException('응급키트를 찾을 수 없습니다.');
    return kit;
  }

  async create(dto: CreateEmergencyKitDto): Promise<EmergencyKit> {
    const kit = this.kitRepository.create(dto);
    return this.kitRepository.save(kit);
  }

  async update(id: string, dto: UpdateEmergencyKitDto): Promise<EmergencyKit> {
    const kit = await this.findOne(id);
    Object.assign(kit, dto);
    return this.kitRepository.save(kit);
  }

  async remove(id: string): Promise<void> {
    const kit = await this.findOne(id);
    await this.kitRepository.remove(kit);
  }

  /** 응급키트 개폐 이벤트 로그 조회 (Alert 테이블에서 DEVICE 타입) */
  async getEvents(kitId: string): Promise<Alert[]> {
    await this.findOne(kitId); // 존재 확인
    return this.alertRepository.find({
      where: { type: 'DEVICE' as any },
      order: { createdAt: 'DESC' },
    });
  }
}
