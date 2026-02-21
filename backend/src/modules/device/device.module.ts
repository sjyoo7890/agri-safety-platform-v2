import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartVest } from '../../database/entities/smart-vest.entity';
import { EmergencyKit } from '../../database/entities/emergency-kit.entity';
import { Sensor } from '../../database/entities/sensor.entity';
import { SensorData } from '../../database/entities/sensor-data.entity';
import { Alert } from '../../database/entities/alert.entity';
import { SmartVestController } from './smart-vest.controller';
import { SmartVestService } from './smart-vest.service';
import { EmergencyKitController } from './emergency-kit.controller';
import { EmergencyKitService } from './emergency-kit.service';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmartVest, EmergencyKit, Sensor, SensorData, Alert]),
  ],
  controllers: [SmartVestController, EmergencyKitController, SensorController],
  providers: [SmartVestService, EmergencyKitService, SensorService],
  exports: [SmartVestService, EmergencyKitService, SensorService],
})
export class DeviceModule {}
