import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ECall, ECallStatus } from '../../database/entities/ecall.entity';
import { CreateECallDto } from './dto/create-ecall.dto';

@Injectable()
export class ECallService {
  constructor(
    @InjectRepository(ECall)
    private readonly ecallRepository: Repository<ECall>,
  ) {}

  async create(dto: CreateECallDto): Promise<ECall> {
    const ecall = this.ecallRepository.create(dto);
    return this.ecallRepository.save(ecall);
  }

  async findHistory(farmId?: string): Promise<ECall[]> {
    const where = farmId ? { farmId } : {};
    return this.ecallRepository.find({
      where,
      relations: ['farm', 'worker'],
      order: { createdAt: 'DESC' },
    });
  }

  async resolve(id: string): Promise<ECall> {
    const ecall = await this.ecallRepository.findOne({ where: { id } });
    if (!ecall) throw new NotFoundException('E-Call을 찾을 수 없습니다.');
    ecall.status = ECallStatus.RESOLVED;
    ecall.resolvedAt = new Date();
    return this.ecallRepository.save(ecall);
  }
}
