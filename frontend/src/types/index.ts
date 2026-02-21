/** 사용자 역할 */
export enum UserRole {
  ADMIN = 'admin',
  FARM_MANAGER = 'farm_manager',
  GOVT_MANAGER = 'govt_manager',
  EDU_MANAGER = 'edu_manager',
  WORKER = 'worker',
}

/** 위험 등급 */
export enum RiskLevel {
  NORMAL = 'normal',
  CAUTION = 'caution',
  WARNING = 'warning',
  DANGER = 'danger',
}

/** 6대 사고유형 */
export enum AccidentType {
  FALL = 'FALL',
  ENTANGLE = 'ENTANGLE',
  HEAT = 'HEAT',
  FIRE = 'FIRE',
  ROLLOVER = 'ROLLOVER',
  COLLISION = 'COLLISION',
}
