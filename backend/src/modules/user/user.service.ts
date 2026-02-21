import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const BCRYPT_SALT_ROUNDS = 12;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(farmId?: string): Promise<Omit<User, 'passwordHash'>[]> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.farm', 'farm')
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.role',
        'user.phone',
        'user.farmId',
        'user.isActive',
        'user.createdAt',
        'user.updatedAt',
        'farm.id',
        'farm.name',
      ]);

    if (farmId) {
      query.where('user.farmId = :farmId', { farmId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.farm', 'farm')
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.role',
        'user.phone',
        'user.farmId',
        'user.isActive',
        'user.createdAt',
        'user.updatedAt',
        'farm.id',
        'farm.name',
      ])
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    // 이메일 중복 확인
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // 비밀번호 해시
    const passwordHash = await bcrypt.hash(
      createUserDto.password,
      BCRYPT_SALT_ROUNDS,
    );

    const user = this.userRepository.create({
      email: createUserDto.email,
      passwordHash,
      name: createUserDto.name,
      role: createUserDto.role,
      phone: createUserDto.phone,
      farmId: createUserDto.farmId,
    });

    const saved = await this.userRepository.save(user);
    return this.findOne(saved.id);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 비밀번호 변경 시 해시
    if (updateUserDto.password) {
      user.passwordHash = await bcrypt.hash(
        updateUserDto.password,
        BCRYPT_SALT_ROUNDS,
      );
    }

    if (updateUserDto.name !== undefined) user.name = updateUserDto.name;
    if (updateUserDto.role !== undefined) user.role = updateUserDto.role;
    if (updateUserDto.phone !== undefined) user.phone = updateUserDto.phone;
    if (updateUserDto.farmId !== undefined) user.farmId = updateUserDto.farmId;
    if (updateUserDto.isActive !== undefined) user.isActive = updateUserDto.isActive;

    await this.userRepository.save(user);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 소프트 삭제: 비활성화
    user.isActive = false;
    await this.userRepository.save(user);
  }
}
