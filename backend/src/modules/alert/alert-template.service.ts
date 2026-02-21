import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertTemplate } from '../../database/entities/alert-template.entity';
import { CreateAlertTemplateDto } from './dto/create-alert-template.dto';
import { UpdateAlertTemplateDto } from './dto/update-alert-template.dto';

@Injectable()
export class AlertTemplateService {
  constructor(
    @InjectRepository(AlertTemplate)
    private readonly templateRepository: Repository<AlertTemplate>,
  ) {}

  async findAll(): Promise<AlertTemplate[]> {
    return this.templateRepository.find({ order: { alertType: 'ASC', severity: 'ASC' } });
  }

  async create(dto: CreateAlertTemplateDto): Promise<AlertTemplate> {
    const template = this.templateRepository.create(dto);
    return this.templateRepository.save(template);
  }

  async update(id: string, dto: UpdateAlertTemplateDto): Promise<AlertTemplate> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) throw new NotFoundException('알림 템플릿을 찾을 수 없습니다.');
    Object.assign(template, dto);
    return this.templateRepository.save(template);
  }

  async remove(id: string): Promise<void> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) throw new NotFoundException('알림 템플릿을 찾을 수 없습니다.');
    await this.templateRepository.remove(template);
  }
}
