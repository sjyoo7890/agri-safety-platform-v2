import { RiskLevel, AccidentType } from '@/types';

/** 위험등급별 색상 및 라벨 */
export const RISK_LEVEL_CONFIG = {
  [RiskLevel.NORMAL]: { label: '정상', color: '#22C55E', min: 0, max: 25 },
  [RiskLevel.CAUTION]: { label: '주의', color: '#EAB308', min: 26, max: 50 },
  [RiskLevel.WARNING]: { label: '경고', color: '#F97316', min: 51, max: 75 },
  [RiskLevel.DANGER]: { label: '위험', color: '#EF4444', min: 76, max: 100 },
} as const;

/** 6대 사고유형 라벨 */
export const ACCIDENT_TYPE_LABELS: Record<AccidentType, string> = {
  [AccidentType.FALL]: '추락/넘어짐',
  [AccidentType.ENTANGLE]: '끼임/감김',
  [AccidentType.HEAT]: '온열질환/질식',
  [AccidentType.FIRE]: '전기화재',
  [AccidentType.ROLLOVER]: '차량 전도/전복',
  [AccidentType.COLLISION]: '농기계-작업자 충돌',
};
