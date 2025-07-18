import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createRandomHorse } from 'engine/src/horse';
import { Repository } from 'typeorm';
import { HorseEntity } from './entities/horse.entity';

@Injectable()
export class HorseService {
  constructor(
    @InjectRepository(HorseEntity)
    private readonly horseRepo: Repository<HorseEntity>,
  ) {}

  async createHorses(raceId: number): Promise<HorseEntity[]> {
    const horses = new Array<HorseEntity>(10);
    for (let index = 0; index < horses.length; index++) {
      const horseId = index + 1;
      const horse = createRandomHorse(horseId, `Horse${horseId}`);
      horses[index] = this.horseRepo.create({
        raceId,
        ...horse,
      });
    }
    return this.horseRepo.save(horses);
  }

  async findHorseAll(): Promise<HorseEntity[]> {
    return this.horseRepo.find();
  }

  async findHorseAllByRaceId(raceId: number): Promise<HorseEntity[]> {
    return this.horseRepo.find({ where: { raceId } });
  }
}
