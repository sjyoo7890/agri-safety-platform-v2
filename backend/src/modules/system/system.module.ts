import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSetting } from '../../database/entities/system-setting.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { ApiKey } from '../../database/entities/api-key.entity';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { SmartVest } from '../../database/entities/smart-vest.entity';
import { EmergencyKit } from '../../database/entities/emergency-kit.entity';
import { Sensor } from '../../database/entities/sensor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SystemSetting,
      ApiKey,
      SmartVest,
      EmergencyKit,
      Sensor,
    ]),
  ],
  controllers: [SettingsController, ApiKeyController, AssetController],
  providers: [SettingsService, ApiKeyService, AssetService],
  exports: [SettingsService],
})
export class SystemModule {}
