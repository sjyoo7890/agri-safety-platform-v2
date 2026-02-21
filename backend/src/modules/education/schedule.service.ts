import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EduSchedule, ScheduleStatus } from '../../database/entities';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(EduSchedule)
    private readonly repo: Repository<EduSchedule>,
  ) {}

  async create(dto: CreateScheduleDto): Promise<EduSchedule> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(): Promise<EduSchedule[]> {
    const list = await this.repo.find({ order: { scheduledDate: 'ASC' } });
    if (list.length > 0) return list;
    return this.simulateSchedules();
  }

  async findOne(id: string): Promise<EduSchedule> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('교육 일정을 찾을 수 없습니다.');
    return entity;
  }

  async update(id: string, dto: UpdateScheduleDto): Promise<EduSchedule> {
    await this.findOne(id);
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }

  private simulateSchedules(): EduSchedule[] {
    const schedules: Partial<EduSchedule>[] = [
      {
        id: 's0000001-0000-0000-0000-000000000001',
        title: '신규 작업자 VR 안전교육 (추락)',
        farmId: null as any,
        contentIds: ['c0000001-0000-0000-0000-000000000001'],
        instructorName: '김안전',
        scheduledDate: '2026-02-20',
        startTime: '09:00',
        endTime: '12:00',
        location: '안전교육센터 A동',
        maxParticipants: 10,
        participantIds: ['w001', 'w002', 'w004'],
        status: ScheduleStatus.PLANNED,
        notes: '신규 작업자 필수 교육',
        createdAt: new Date('2026-02-01'),
        updatedAt: new Date('2026-02-01'),
      },
      {
        id: 's0000001-0000-0000-0000-000000000002',
        title: '트랙터 전복 사고 예방 교육',
        farmId: null as any,
        contentIds: ['c0000001-0000-0000-0000-000000000005'],
        instructorName: '이강사',
        scheduledDate: '2026-02-25',
        startTime: '14:00',
        endTime: '17:00',
        location: '순회교육 - 행복농장',
        maxParticipants: 8,
        participantIds: ['w001', 'w003'],
        status: ScheduleStatus.PLANNED,
        notes: '경사지 작업 농장 대상',
        createdAt: new Date('2026-02-05'),
        updatedAt: new Date('2026-02-05'),
      },
      {
        id: 's0000001-0000-0000-0000-000000000003',
        title: '응급키트 실습 교육',
        farmId: null as any,
        contentIds: ['c0000001-0000-0000-0000-000000000007'],
        instructorName: '박응급',
        scheduledDate: '2026-03-05',
        startTime: '10:00',
        endTime: '12:00',
        location: '안전교육센터 B동',
        maxParticipants: 15,
        participantIds: ['w001', 'w002', 'w003', 'w004', 'w005'],
        status: ScheduleStatus.PLANNED,
        notes: null as any,
        createdAt: new Date('2026-02-10'),
        updatedAt: new Date('2026-02-10'),
      },
      {
        id: 's0000001-0000-0000-0000-000000000004',
        title: '끼임/감김 사고 VR 체험',
        farmId: null as any,
        contentIds: ['c0000001-0000-0000-0000-000000000002'],
        instructorName: '김안전',
        scheduledDate: '2026-02-15',
        startTime: '09:00',
        endTime: '11:30',
        location: '안전교육센터 A동',
        maxParticipants: 10,
        participantIds: ['w002', 'w005'],
        status: ScheduleStatus.COMPLETED,
        notes: '완료',
        createdAt: new Date('2026-01-20'),
        updatedAt: new Date('2026-02-15'),
      },
    ];
    return schedules as EduSchedule[];
  }
}
