import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sensor } from '../../database/entities/sensor.entity';
import { SensorData } from '../../database/entities/sensor-data.entity';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { UpdateThresholdDto } from './dto/update-threshold.dto';

@Injectable()
export class SensorService {
  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
    @InjectRepository(SensorData)
    private readonly sensorDataRepository: Repository<SensorData>,
  ) {}

  async findAll(workplaceId?: string): Promise<Sensor[]> {
    const where = workplaceId ? { workplaceId } : {};
    return this.sensorRepository.find({
      where,
      relations: ['workplace'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Sensor> {
    const sensor = await this.sensorRepository.findOne({
      where: { id },
      relations: ['workplace'],
    });
    if (!sensor) throw new NotFoundException('환경센서를 찾을 수 없습니다.');
    return sensor;
  }

  async create(dto: CreateSensorDto): Promise<Sensor> {
    const sensor = this.sensorRepository.create(dto);
    return this.sensorRepository.save(sensor);
  }

  async update(id: string, dto: UpdateSensorDto): Promise<Sensor> {
    const sensor = await this.findOne(id);
    Object.assign(sensor, dto);
    return this.sensorRepository.save(sensor);
  }

  async remove(id: string): Promise<void> {
    const sensor = await this.findOne(id);
    await this.sensorRepository.remove(sensor);
  }

  /** 센서 시계열 데이터 조회 */
  async getData(sensorId: string, from: Date, to: Date): Promise<SensorData[]> {
    await this.findOne(sensorId); // 존재 확인
    return this.sensorDataRepository.find({
      where: {
        sensorId,
        time: Between(from, to),
      },
      order: { time: 'ASC' },
    });
  }

  /** 임계값 설정 업데이트 */
  async updateThreshold(id: string, dto: UpdateThresholdDto): Promise<Sensor> {
    const sensor = await this.findOne(id);
    sensor.thresholdConfig = dto;
    return this.sensorRepository.save(sensor);
  }
}
