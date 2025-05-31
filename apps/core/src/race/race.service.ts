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
      startedAt: new Date(),
    });
    return this.raceRepo.save(race);
  }

  async stopRace(): Promise<RaceEntity | null> {
    const race = await this.getLatestRace();
    if (!race) {
      return null;
    }
    race.state = 'finished';
    race.stoppedAt = new Date();
    return this.raceRepo.save(race);
  }

  async getLatestRace(): Promise<RaceEntity | null> {
    return this.raceRepo.findOne({
      where: {},
      order: { id: 'DESC' },
    });
  }
}
