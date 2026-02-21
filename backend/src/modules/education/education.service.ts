import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from '../../database/entities';
import { EduAccidentType } from '../../database/entities/edu-content.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { QueryProgressDto } from './dto/query-progress.dto';

/** 작업자별 이수 현황 요약 */
export interface WorkerProgress {
  workerId: string;
  workerName: string;
  farmName: string;
  courses: {
    accidentType: string;
    contentTitle: string;
    completed: boolean;
    score: number | null;
    completedAt: string | null;
  }[];
  completionRate: number;
}

/** AI 성취도 분석 결과 */
export interface AchievementAnalysis {
  workerId: string;
  workerName: string;
  overallScore: number;
  weaknesses: { type: string; label: string; description: string; severity: string }[];
  recommendedMissions: { contentTitle: string; reason: string }[];
  trainingHistory: { date: string; contentTitle: string; score: number }[];
}

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly repo: Repository<Education>,
  ) {}

  async createProgress(dto: CreateEducationDto): Promise<Education> {
    const entity = this.repo.create(dto);
    if (dto.completed && !dto.completedAt) {
      entity.completedAt = new Date();
    }
    return this.repo.save(entity);
  }

  /** 교육 이수 현황 (작업자별 매트릭스) */
  async getProgress(query: QueryProgressDto): Promise<WorkerProgress[]> {
    const qb = this.repo
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.worker', 'w')
      .leftJoinAndSelect('e.content', 'c')
      .leftJoinAndSelect('w.farm', 'f');

    if (query.farmId) qb.andWhere('w.farm_id = :farmId', { farmId: query.farmId });
    if (query.workerId) qb.andWhere('e.worker_id = :workerId', { workerId: query.workerId });

    const records = await qb.orderBy('w.created_at', 'ASC').getMany();
    if (records.length > 0) {
      return this.buildProgressFromRecords(records);
    }
    return this.simulateProgress();
  }

  /** 작업자별 교육 이수 현황 */
  async getWorkerProgress(workerId: string): Promise<WorkerProgress | null> {
    const all = await this.getProgress({ workerId });
    return all[0] ?? null;
  }

  /** AI 성취도 분석 */
  async getAnalysis(workerId: string): Promise<AchievementAnalysis> {
    const records = await this.repo.find({
      where: { workerId },
      relations: ['content'],
      order: { createdAt: 'DESC' },
    });
    if (records.length > 0) {
      return this.buildAnalysisFromRecords(workerId, records);
    }
    return this.simulateAnalysis(workerId);
  }

  private buildProgressFromRecords(records: Education[]): WorkerProgress[] {
    const byWorker = new Map<string, Education[]>();
    records.forEach((r) => {
      const list = byWorker.get(r.workerId) ?? [];
      list.push(r);
      byWorker.set(r.workerId, list);
    });

    return Array.from(byWorker.entries()).map(([workerId, recs]) => {
      const worker = recs[0].worker;
      const courses = recs.map((r) => ({
        accidentType: r.content?.accidentType ?? 'UNKNOWN',
        contentTitle: r.content?.title ?? '',
        completed: r.completed,
        score: r.score,
        completedAt: r.completedAt?.toISOString() ?? null,
      }));
      const completed = courses.filter((c) => c.completed).length;
      return {
        workerId,
        workerName: (worker as any)?.user?.name ?? '작업자',
        farmName: (worker as any)?.farm?.name ?? '농장',
        courses,
        completionRate: courses.length > 0 ? Math.round((completed / 6) * 100) : 0,
      };
    });
  }

  private buildAnalysisFromRecords(workerId: string, records: Education[]): AchievementAnalysis {
    const avgScore = records.reduce((s, r) => s + (r.score ?? 0), 0) / (records.length || 1);
    return {
      workerId,
      workerName: '작업자',
      overallScore: Math.round(avgScore),
      weaknesses: (records[0]?.weaknessAnalysis as any[]) ?? [],
      recommendedMissions: [],
      trainingHistory: records.map((r) => ({
        date: r.completedAt?.toISOString()?.slice(0, 10) ?? r.createdAt.toISOString().slice(0, 10),
        contentTitle: r.content?.title ?? '',
        score: r.score ?? 0,
      })),
    };
  }

  /** 시뮬레이션: 이수 현황 */
  private simulateProgress(): WorkerProgress[] {
    const workers = [
      { id: 'w001', name: '홍길동', farm: '행복농장' },
      { id: 'w002', name: '김철수', farm: '푸른농장' },
      { id: 'w003', name: '박영희', farm: '행복농장' },
      { id: 'w004', name: '이민수', farm: '새벽농장' },
      { id: 'w005', name: '정수진', farm: '푸른농장' },
    ];
    const types = Object.values(EduAccidentType);
    const titles: Record<string, string> = {
      FALL: '사다리 작업 중 미끄러짐 시뮬레이션',
      ENTANGLE: '회전축 접근 위험 체험',
      HEAT: '고온 비닐하우스 온열질환 체험',
      FIRE: '노후 전선 합선 화재 대응',
      ROLLOVER: '경사지 트랙터 전복 체험',
      COLLISION: '콤바인 후진 충돌 방지 훈련',
    };
    const completionMap: Record<string, boolean[]> = {
      w001: [true, true, true, false, false, true],
      w002: [true, true, false, true, true, false],
      w003: [true, true, true, true, true, true],
      w004: [true, false, false, false, true, false],
      w005: [false, true, true, true, false, true],
    };
    const scoreMap: Record<string, (number | null)[]> = {
      w001: [92, 88, 95, null, null, 90],
      w002: [85, 91, null, 87, 93, null],
      w003: [90, 86, 88, 92, 89, 94],
      w004: [78, null, null, null, 81, null],
      w005: [null, 83, 79, 88, null, 91],
    };

    return workers.map((w) => {
      const courses = types.map((t, i) => ({
        accidentType: t,
        contentTitle: titles[t],
        completed: completionMap[w.id][i],
        score: scoreMap[w.id][i],
        completedAt: completionMap[w.id][i] ? `2026-0${Math.min(i + 1, 9)}-${10 + i}T09:00:00Z` : null,
      }));
      const completedCount = courses.filter((c) => c.completed).length;
      return {
        workerId: w.id,
        workerName: w.name,
        farmName: w.farm,
        courses,
        completionRate: Math.round((completedCount / 6) * 100),
      };
    });
  }

  /** 시뮬레이션: AI 성취도 분석 */
  private simulateAnalysis(workerId: string): AchievementAnalysis {
    return {
      workerId,
      workerName: '홍길동',
      overallScore: 82,
      weaknesses: [
        { type: 'perception_failure', label: '인지실패', description: '추락 위험 요소를 인지하지 못하는 경향', severity: 'high' },
        { type: 'abrupt_operation', label: '급조작', description: '트랙터 핸들 급조작 빈도 높음', severity: 'medium' },
        { type: 'procedure_skip', label: '절차누락', description: '안전 확인 절차 25% 생략', severity: 'medium' },
        { type: 'delayed_response', label: '반응지연', description: '화재 감지 후 평균 4.2초 지연', severity: 'low' },
      ],
      recommendedMissions: [
        { contentTitle: '사다리 작업 중 미끄러짐 시뮬레이션', reason: '추락 위험 인지 능력 향상 필요' },
        { contentTitle: '경사지 트랙터 전복 체험', reason: '핸들 급조작 교정 훈련' },
        { contentTitle: '노후 전선 합선 화재 대응', reason: '화재 감지 반응속도 개선' },
      ],
      trainingHistory: [
        { date: '2026-02-10', contentTitle: '사다리 작업 중 미끄러짐 시뮬레이션', score: 92 },
        { date: '2026-01-25', contentTitle: '회전축 접근 위험 체험', score: 88 },
        { date: '2026-01-15', contentTitle: '고온 비닐하우스 온열질환 체험', score: 95 },
        { date: '2025-12-20', contentTitle: '콤바인 후진 충돌 방지 훈련', score: 90 },
        { date: '2025-11-30', contentTitle: '사다리 작업 중 미끄러짐 시뮬레이션', score: 75 },
        { date: '2025-10-15', contentTitle: '경사지 트랙터 전복 체험', score: 68 },
      ],
    };
  }
}
