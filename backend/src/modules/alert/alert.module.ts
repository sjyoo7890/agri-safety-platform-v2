import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from '../../database/entities/alert.entity';
import { AlertRule } from '../../database/entities/alert-rule.entity';
import { AlertRecipient } from '../../database/entities/alert-recipient.entity';
import { ECall } from '../../database/entities/ecall.entity';
import { AlertTemplate } from '../../database/entities/alert-template.entity';
import { EscalationRule } from '../../database/entities/escalation-rule.entity';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { AlertRuleController } from './alert-rule.controller';
import { AlertRuleService } from './alert-rule.service';
import { ECallController } from './ecall.controller';
import { ECallService } from './ecall.service';
import { AlertTemplateController } from './alert-template.controller';
import { AlertTemplateService } from './alert-template.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Alert,
      AlertRule,
      AlertRecipient,
      ECall,
      AlertTemplate,
      EscalationRule,
    ]),
  ],
  controllers: [
    AlertController,
    AlertRuleController,
    ECallController,
    AlertTemplateController,
  ],
  providers: [
    AlertService,
    AlertRuleService,
    ECallService,
    AlertTemplateService,
  ],
  exports: [AlertService, ECallService],
})
export class AlertModule {}
