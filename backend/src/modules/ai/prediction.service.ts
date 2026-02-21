import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AIPrediction, PredictionModelType } from '../../database/entities/ai-prediction.entity';
import { RiskAssessment } from '../../database/entities/risk-assessment.entity';

/** 6대 사고유형 실시간 예측 결과 */
export interface RealtimePrediction {
  modelType: string;
  label: string;
  prediction: number;
  confidence: number;
  latestId: string | null;
}

/** XAI 분석 결과 */
export interface XaiResult {
  predictionId: string;
  modelType: string;
  prediction: number;
  xaiFactors: Array<{ feature: string; contribution: number }>;
  llmMessage: string | null;
}

/** 모델 성능 지표 */
export interface ModelPerformance {
  modelType: string;
  label: string;
  accuracy: number;
  auroc: number;
  falseAlarmRate: number;
  status: 'normal' | 'caution' | 'danger';
  totalPredictions: number;
}

/** 위험요인 추천 */
export interface HazardRecommendation {
  code: string;
  name: string;
  score: number;
  source: string;
}

/** 감소대책 */
export interface Countermeasure {
  code: string;
  action: string;
  priority: number;
}

const MODEL_LABELS: Record<string, string> = {
  FALL: '추락/넘어짐',
  ENTANGLE: '끼임/감김',
  HEAT: '온열질환/질식',
  FIRE: '전기화재',
  ROLLOVER: '차량 전도/전복',
  COLLISION: '농기계-작업자 충돌',
};

@Injectable()
export class PredictionService {
  constructor(
    @InjectRepository(AIPrediction)
    private readonly predictionRepository: Repository<AIPrediction>,
    @InjectRepository(RiskAssessment)
    private readonly riskRepository: Repository<RiskAssessment>,
  ) {}

  /** 6대 사고유형 실시간 예측 결과 */
  async getRealtimePredictions(farmId?: string, workerId?: string): Promise<RealtimePrediction[]> {
    const models = Object.values(PredictionModelType);
    const results: RealtimePrediction[] = [];

    for (const modelType of models) {
      const where: Record<string, unknown> = { modelType };
      if (farmId) where.farmId = farmId;
      if (workerId) where.workerId = workerId;

      const latest = await this.predictionRepository.findOne({
        where,
        order: { createdAt: 'DESC' },
      });

      // DB에 데이터가 없으면 시뮬레이션
      results.push({
        modelType,
        label: MODEL_LABELS[modelType] ?? modelType,
        prediction: latest?.prediction ?? this.simulateScore(modelType),
        confidence: latest?.confidence ?? (0.85 + Math.random() * 0.14),
        latestId: latest?.id ?? null,
      });
    }

    return results;
  }

  /** XAI 분석 결과 */
  async getXaiResult(predictionId: string): Promise<XaiResult> {
    const prediction = await this.predictionRepository.findOne({ where: { id: predictionId } });
    if (!prediction) throw new NotFoundException('예측 결과를 찾을 수 없습니다.');

    const xaiFactors = (prediction.xaiResult as Array<{ feature: string; contribution: number }>) ?? this.simulateXai(prediction.modelType);

    return {
      predictionId: prediction.id,
      modelType: prediction.modelType,
      prediction: prediction.prediction,
      xaiFactors,
      llmMessage: prediction.llmMessage,
    };
  }

  /** 모델 성능 지표 */
  async getModelPerformance(): Promise<ModelPerformance[]> {
    const models = Object.values(PredictionModelType);
    const results: ModelPerformance[] = [];

    for (const modelType of models) {
      const total = await this.predictionRepository.count({ where: { modelType } });
      const falseAlarms = await this.predictionRepository.count({ where: { modelType, isFalseAlarm: true } });

      const falseAlarmRate = total > 0 ? (falseAlarms / total) * 100 : this.simulateFalseAlarmRate(modelType);

      // 시뮬레이션 성능 데이터
      const perf = this.simulatePerformance(modelType);

      let status: 'normal' | 'caution' | 'danger' = 'normal';
      if (perf.accuracy < 0.95 || falseAlarmRate > 10) status = 'danger';
      else if (perf.accuracy < 0.98 || falseAlarmRate > 5) status = 'caution';

      results.push({
        modelType,
        label: MODEL_LABELS[modelType] ?? modelType,
        accuracy: perf.accuracy,
        auroc: perf.auroc,
        falseAlarmRate: Math.round(falseAlarmRate * 10) / 10,
        status,
        totalPredictions: total,
      });
    }

    return results;
  }

  /** 오경보 마킹 */
  async markFalseAlarm(predictionId: string): Promise<AIPrediction> {
    const prediction = await this.predictionRepository.findOne({ where: { id: predictionId } });
    if (!prediction) throw new NotFoundException('예측 결과를 찾을 수 없습니다.');
    prediction.isFalseAlarm = true;
    return this.predictionRepository.save(prediction);
  }

  /** 현재 동적 위험성평가 결과 */
  async getCurrentRiskAssessment(farmId?: string): Promise<RiskAssessment | null> {
    const where: Record<string, unknown> = {};
    if (farmId) where.farmId = farmId;

    const assessment = await this.riskRepository.findOne({
      where,
      order: { assessedAt: 'DESC' },
      relations: ['farm', 'workplace'],
    });

    // DB에 없으면 시뮬레이션 반환
    if (!assessment) {
      return this.simulateRiskAssessment() as unknown as RiskAssessment;
    }

    return assessment;
  }

  /** 위험성평가 이력 조회 */
  async getRiskHistory(farmId?: string, workplaceId?: string, from?: string, to?: string): Promise<RiskAssessment[]> {
    const where: Record<string, unknown> = {};
    if (farmId) where.farmId = farmId;
    if (workplaceId) where.workplaceId = workplaceId;
    if (from && to) where.assessedAt = Between(new Date(from), new Date(to));

    return this.riskRepository.find({
      where,
      relations: ['farm', 'workplace'],
      order: { assessedAt: 'DESC' },
      take: 100,
    });
  }

  /** 위험요인 추천 목록 */
  async getHazards(farmId?: string): Promise<HazardRecommendation[]> {
    // 실제로는 AI 서비스의 온톨로지/지식그래프에서 가져옴
    // 현재 시뮬레이션
    return [
      { code: 'H001', name: '고온 환경 (WBGT 31°C 이상)', score: 85, source: '환경센서' },
      { code: 'H002', name: '사다리 작업 (2m 이상 높이)', score: 72, source: '작업일지' },
      { code: 'H003', name: '장시간 연속작업 (3시간 초과)', score: 65, source: '근무기록' },
      { code: 'H004', name: '농기계 근접 작업', score: 58, source: 'UWB 센서' },
      { code: 'H005', name: '밀폐공간 가스 농도 상승', score: 45, source: '가스센서' },
    ];
  }

  /** 감소대책 목록 */
  async getCountermeasures(farmId?: string): Promise<Countermeasure[]> {
    return [
      { code: 'C001', action: '즉시 휴식 (그늘 또는 실내 이동)', priority: 1 },
      { code: 'C002', action: '수분 및 전해질 섭취 권장', priority: 2 },
      { code: 'C003', action: '안전 고리 체결 확인 (사다리 작업)', priority: 3 },
      { code: 'C004', action: '농기계 작동 중지 후 접근', priority: 4 },
      { code: 'C005', action: '환기 장치 가동 및 가스 농도 재측정', priority: 5 },
    ];
  }

  // ─── 시뮬레이션 헬퍼 ─────────────────────────────────

  private simulateScore(modelType: string): number {
    const bases: Record<string, number> = {
      FALL: 35, ENTANGLE: 18, HEAT: 62, FIRE: 12, ROLLOVER: 25, COLLISION: 40,
    };
    const base = bases[modelType] ?? 30;
    return Math.round(base + (Math.random() - 0.5) * 20);
  }

  private simulateXai(modelType: string): Array<{ feature: string; contribution: number }> {
    const features: Record<string, string[]> = {
      FALL: ['합성 가속도', '자세 변화각', '고도 변화', '작업 시간', '기타'],
      ENTANGLE: ['영상 인식', '근접 센서', '진동 패턴', '위치 데이터', '기타'],
      HEAT: ['체온', 'WBGT', '심박수', '누적 작업시간', '기타'],
      FIRE: ['전류 이상', '온도 상승', '아크 신호', '절연저항', '기타'],
      ROLLOVER: ['Roll 각도', 'Pitch 각도', '속도', '조향각', '기타'],
      COLLISION: ['UWB 거리', 'LiDAR', '카메라 감지', '속도 차이', '기타'],
    };

    const featureList = features[modelType] ?? ['요인1', '요인2', '요인3', '요인4', '기타'];
    let remaining = 100;
    return featureList.map((f, i) => {
      const isLast = i === featureList.length - 1;
      const contribution = isLast ? remaining : Math.round(remaining * (0.3 + Math.random() * 0.3));
      remaining -= contribution;
      return { feature: f, contribution };
    });
  }

  private simulatePerformance(modelType: string): { accuracy: number; auroc: number } {
    const perf: Record<string, { accuracy: number; auroc: number }> = {
      FALL: { accuracy: 0.995, auroc: 0.998 },
      ENTANGLE: { accuracy: 0.999, auroc: 0.999 },
      HEAT: { accuracy: 0.952, auroc: 0.912 },
      FIRE: { accuracy: 0.995, auroc: 0.996 },
      ROLLOVER: { accuracy: 0.988, auroc: 0.991 },
      COLLISION: { accuracy: 0.960, auroc: 0.972 },
    };
    return perf[modelType] ?? { accuracy: 0.95, auroc: 0.96 };
  }

  private simulateFalseAlarmRate(modelType: string): number {
    const rates: Record<string, number> = {
      FALL: 3.2, ENTANGLE: 1.1, HEAT: 8.4, FIRE: 2.5, ROLLOVER: 4.0, COLLISION: 5.8,
    };
    return rates[modelType] ?? 5.0;
  }

  private simulateRiskAssessment() {
    return {
      id: '00000000-0000-0000-0000-000000000000',
      farmId: null,
      workplaceId: null,
      riskScore: 67,
      riskLevel: 'warning',
      hazards: [
        { code: 'H001', name: '고온 환경 (WBGT 31°C)', score: 85, source: '환경센서' },
        { code: 'H002', name: '사다리 작업', score: 72, source: '작업일지' },
        { code: 'H003', name: '장시간 연속작업', score: 65, source: '근무기록' },
      ],
      countermeasures: [
        { code: 'C001', action: '즉시 휴식', priority: 1 },
        { code: 'C002', action: '그늘 이동', priority: 2 },
        { code: 'C003', action: '수분 섭취', priority: 3 },
      ],
      assessedAt: new Date().toISOString(),
      expiresAt: null,
    };
  }
}
