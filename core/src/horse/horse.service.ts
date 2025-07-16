import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createRandomHorse } from '../../engine/src/horse';
import { HorseEntity } from './entities/horse.entity';

@Injectable()
export class HorseService {
  constructor(
    @InjectRepository(HorseEntity)
    private readonly horseRepo: Repository<HorseEntity>,
  ) {}

  async createByRaceId(raceId: number): Promise<HorseEntity[]> {
    const horses = new Array<HorseEntity>(10);
    for (let index = 0; index < horses.length; index++) {
      const horseId = index + 1;
      const horseData = createRandomHorse(horseId, `RandomHorse${horseId}`);
      horses[index] = this.horseRepo.create({
        raceId,
        horseId,
        ...horseData,
      });
    }
    return this.horseRepo.save(horses);
  }

  async findAll(): Promise<HorseEntity[]> {
    return this.horseRepo.find();
  }

  async findAllByRaceId(raceId: number): Promise<HorseEntity[]> {
    return this.horseRepo.find({ where: { raceId } });
  }
}
