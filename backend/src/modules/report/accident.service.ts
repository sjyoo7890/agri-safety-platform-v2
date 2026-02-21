import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Accident } from '../../database/entities/accident.entity';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { UpdateAccidentDto } from './dto/update-accident.dto';
import { QueryAccidentDto } from './dto/query-accident.dto';

@Injectable()
export class AccidentService {
  constructor(
    @InjectRepository(Accident)
    private readonly accidentRepository: Repository<Accident>,
  ) {}

  async create(dto: CreateAccidentDto, userId?: string): Promise<Accident> {
    const accident = this.accidentRepository.create({
      ...dto,
      occurredAt: new Date(dto.occurredAt),
      createdBy: userId,
    });
    return this.accidentRepository.save(accident);
  }

  async findAll(query: QueryAccidentDto): Promise<Accident[]> {
    const where: FindOptionsWhere<Accident> = {};
    if (query.type) where.type = query.type;
    if (query.severity) where.severity = query.severity;
    if (query.farmId) where.farmId = query.farmId;
    if (query.isNearMiss !== undefined) where.isNearMiss = query.isNearMiss;
    if (query.from && query.to) {
      where.occurredAt = Between(new Date(query.from), new Date(query.to));
    }

    return this.accidentRepository.find({
      where,
      relations: ['farm', 'workplace', 'worker'],
      order: { occurredAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Accident> {
    const accident = await this.accidentRepository.findOne({
      where: { id },
      relations: ['farm', 'workplace', 'worker'],
    });
    if (!accident) throw new NotFoundException('사고 이력을 찾을 수 없습니다.');
    return accident;
  }

  async update(id: string, dto: UpdateAccidentDto): Promise<Accident> {
    const accident = await this.findOne(id);
    if (dto.occurredAt) {
      (dto as any).occurredAt = new Date(dto.occurredAt);
    }
    Object.assign(accident, dto);
    return this.accidentRepository.save(accident);
  }

  async remove(id: string): Promise<void> {
    const accident = await this.findOne(id);
    await this.accidentRepository.remove(accident);
  }
}
