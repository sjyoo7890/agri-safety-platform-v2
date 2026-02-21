import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EduContent, EduAccidentType, EduContentType, SimulatorType, EduDifficulty, EduContentStatus } from '../../database/entities';
import { CreateEduContentDto } from './dto/create-edu-content.dto';
import { UpdateEduContentDto } from './dto/update-edu-content.dto';

@Injectable()
export class EduContentService {
  constructor(
    @InjectRepository(EduContent)
    private readonly repo: Repository<EduContent>,
  ) {}

  async create(dto: CreateEduContentDto): Promise<EduContent> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(): Promise<EduContent[]> {
    const list = await this.repo.find({ order: { createdAt: 'DESC' } });
    if (list.length > 0) return list;
    return this.simulateContents();
  }

  async findOne(id: string): Promise<EduContent> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('교육 콘텐츠를 찾을 수 없습니다.');
    return entity;
  }

  async update(id: string, dto: UpdateEduContentDto): Promise<EduContent> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }

  /** 시뮬레이션 데이터 */
  private simulateContents(): EduContent[] {
    const contents: Partial<EduContent>[] = [
      {
        id: 'c0000001-0000-0000-0000-000000000001',
        title: '사다리 작업 중 미끄러짐 시뮬레이션',
        accidentType: EduAccidentType.FALL,
        type: EduContentType.VR_CONTENT,
        simulatorType: SimulatorType.SIX_AXIS,
        version: '2.1.0',
        description: '사다리 작업 중 미끄러짐, 지붕 작업 중 추락 체험',
        durationMin: 30,
        difficulty: EduDifficulty.INTERMEDIATE,
        status: EduContentStatus.PUBLISHED,
        createdAt: new Date('2025-06-01'),
        updatedAt: new Date('2025-12-15'),
      },
      {
        id: 'c0000001-0000-0000-0000-000000000002',
        title: '회전축 접근 위험 체험',
        accidentType: EduAccidentType.ENTANGLE,
        type: EduContentType.VR_CONTENT,
        simulatorType: SimulatorType.TREADMILL,
        version: '1.3.0',
        description: '회전축 접근, 벨트 감김, 수확기 투입구 위험 체험',
        durationMin: 25,
        difficulty: EduDifficulty.BEGINNER,
        status: EduContentStatus.PUBLISHED,
        createdAt: new Date('2025-07-10'),
        updatedAt: new Date('2025-11-20'),
      },
      {
        id: 'c0000001-0000-0000-0000-000000000003',
        title: '고온 비닐하우스 온열질환 체험',
        accidentType: EduAccidentType.HEAT,
        type: EduContentType.VR_CONTENT,
        simulatorType: SimulatorType.SIX_AXIS,
        version: '1.0.0',
        description: '고온 비닐하우스, 밀폐 축사 가스 중독 시나리오',
        durationMin: 35,
        difficulty: EduDifficulty.ADVANCED,
        status: EduContentStatus.PUBLISHED,
        createdAt: new Date('2025-08-01'),
        updatedAt: new Date('2026-01-10'),
      },
      {
        id: 'c0000001-0000-0000-0000-000000000004',
        title: '노후 전선 합선 화재 대응',
        accidentType: EduAccidentType.FIRE,
        type: EduContentType.VR_CONTENT,
        simulatorType: SimulatorType.TREADMILL,
        version: '1.1.0',
        description: '노후 전선 합선, 전기울타리 감전 시나리오',
        durationMin: 20,
        difficulty: EduDifficulty.BEGINNER,
        status: EduContentStatus.PUBLISHED,
        createdAt: new Date('2025-09-15'),
        updatedAt: new Date('2025-12-01'),
      },
      {
        id: 'c0000001-0000-0000-0000-000000000005',
        title: '경사지 트랙터 전복 체험',
        accidentType: EduAccidentType.ROLLOVER,
        type: EduContentType.VR_CONTENT,
        simulatorType: SimulatorType.SIX_AXIS,
        version: '2.0.0',
        description: '경사지 트랙터 전복, 과적 상태 급회전 시나리오',
        durationMin: 40,
        difficulty: EduDifficulty.ADVANCED,
        status: EduContentStatus.PUBLISHED,
        createdAt: new Date('2025-05-20'),
        updatedAt: new Date('2026-01-05'),
      },
      {
        id: 'c0000001-0000-0000-0000-000000000006',
        title: '콤바인 후진 충돌 방지 훈련',
        accidentType: EduAccidentType.COLLISION,
        type: EduContentType.VR_CONTENT,
        simulatorType: SimulatorType.TREADMILL,
        version: '1.2.0',
        description: '콤바인 후진 중 작업자 미감지, 교차 작업 충돌 시나리오',
        durationMin: 30,
        difficulty: EduDifficulty.INTERMEDIATE,
        status: EduContentStatus.PUBLISHED,
        createdAt: new Date('2025-10-01'),
        updatedAt: new Date('2026-02-01'),
      },
      {
        id: 'c0000001-0000-0000-0000-000000000007',
        title: '응급키트 사용법 교육',
        accidentType: EduAccidentType.FALL,
        type: EduContentType.KIT_TRAINING,
        simulatorType: null as unknown as SimulatorType,
        version: '1.0.0',
        description: '거치형/탑재형 응급키트 사용 실습 교육',
        durationMin: 45,
        difficulty: EduDifficulty.BEGINNER,
        status: EduContentStatus.DRAFT,
        createdAt: new Date('2026-01-10'),
        updatedAt: new Date('2026-02-01'),
      },
    ];
    return contents as EduContent[];
  }
}
