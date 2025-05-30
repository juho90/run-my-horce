import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorseEntity } from './entities/horse.entity';

@Injectable()
export class HorseService {
  constructor(
    @InjectRepository(HorseEntity)
    private readonly horseRepo: Repository<HorseEntity>,
  ) {}

  async create(data: Partial<HorseEntity>): Promise<HorseEntity> {
    const horse = this.horseRepo.create(data);
    return this.horseRepo.save(horse);
  }

  async findAll(): Promise<HorseEntity[]> {
    return this.horseRepo.find();
  }
}
