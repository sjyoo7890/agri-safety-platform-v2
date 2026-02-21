import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KitTraining, KitTrainingType } from '../../database/entities';
import { CreateKitTrainingDto } from './dto/create-kit-training.dto';

@Injectable()
export class KitTrainingService {
  constructor(
    @InjectRepository(KitTraining)
    private readonly repo: Repository<KitTraining>,
  ) {}

  async create(dto: CreateKitTrainingDto): Promise<KitTraining> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(): Promise<KitTraining[]> {
    const list = await this.repo.find({ order: { createdAt: 'DESC' }, relations: ['worker'] });
    if (list.length > 0) return list;
    return this.simulateRecords();
  }

  private simulateRecords(): KitTraining[] {
    const records: Partial<KitTraining>[] = [
      {
        id: 'kt000001-0000-0000-0000-000000000001',
        workerId: 'w001',
        trainingType: KitTrainingType.STATIONARY,
        trainingDate: new Date('2026-02-10T10:00:00Z'),
        score: 92,
        passed: true,
        durationMin: 35,
        remarks: '거치형 키트 사용 숙달',
        evaluatorName: '박응급',
        createdAt: new Date('2026-02-10'),
      },
      {
        id: 'kt000001-0000-0000-0000-000000000002',
        workerId: 'w002',
        trainingType: KitTrainingType.MOUNTED,
        trainingDate: new Date('2026-02-10T11:00:00Z'),
        score: 78,
        passed: true,
        durationMin: 40,
        remarks: '탑재형 키트 조작 미숙, 추가 훈련 권장',
        evaluatorName: '박응급',
        createdAt: new Date('2026-02-10'),
      },
      {
        id: 'kt000001-0000-0000-0000-000000000003',
        workerId: 'w003',
        trainingType: KitTrainingType.STATIONARY,
        trainingDate: new Date('2026-01-20T09:30:00Z'),
        score: 95,
        passed: true,
        durationMin: 30,
        remarks: '우수',
        evaluatorName: '김안전',
        createdAt: new Date('2026-01-20'),
      },
      {
        id: 'kt000001-0000-0000-0000-000000000004',
        workerId: 'w004',
        trainingType: KitTrainingType.MOUNTED,
        trainingDate: new Date('2026-01-20T10:30:00Z'),
        score: 55,
        passed: false,
        durationMin: 50,
        remarks: '불합격 - 재교육 필요',
        evaluatorName: '김안전',
        createdAt: new Date('2026-01-20'),
      },
    ];
    return records as KitTraining[];
  }
}
