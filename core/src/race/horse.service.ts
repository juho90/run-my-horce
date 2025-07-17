import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createRandomHorse, Horse } from 'engine/src/horse';
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
      const horseData = createRandomHorse(horseId, `RandomHorse${horseId}`);
      horses[index] = this.horseRepo.create({
        raceId,
        horseId,
        ...horseData,
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

  convertHorsesForRace(horses: HorseEntity[]): Horse[] {
    const convertedHorses: Horse[] = new Array<Horse>(horses.length);
    for (let index = 0; index < horses.length; index++) {
      const horse = horses[index];
      convertedHorses[index] = new Horse(horse.horseId, horse.name, {
        strength: horse.strength,
        endurance: horse.endurance,
        agility: horse.agility,
        intelligence: horse.intelligence,
        spirit: horse.spirit,
      });
    }
    return convertedHorses;
  }
}
