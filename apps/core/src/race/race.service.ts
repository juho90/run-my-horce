import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RaceEntity } from './entities/race.entity';

@Injectable()
export class RaceService {
  constructor(
    @InjectRepository(RaceEntity)
    private readonly raceRepo: Repository<RaceEntity>,
  ) {}

  async startRace(): Promise<RaceEntity> {
    const race = this.raceRepo.create({
      state: 'started',
    });
    return this.raceRepo.save(race);
  }

  async stopRace(): Promise<RaceEntity | null> {
    const race = await this.raceRepo.findOne({
      where: { state: 'started' },
      order: { started_at: 'DESC' },
    });

    if (!race) {
      return null;
    }

    race.state = 'finished';
    race.ended_at = new Date();
    return this.raceRepo.save(race);
  }
}
