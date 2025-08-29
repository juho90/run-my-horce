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

  async findRaceAll(): Promise<RaceEntity[]> {
    return this.raceRepo.find();
  }

  async findRace(raceId: number): Promise<RaceEntity | null> {
    return this.raceRepo.findOne({
      where: { raceId },
    });
  }

  async findLatestRace(): Promise<RaceEntity | null> {
    return this.raceRepo.findOne({
      where: {},
      order: { raceId: 'DESC' },
    });
  }

  async startRace(): Promise<RaceEntity> {
    const race = this.raceRepo.create({
      state: 'started',
      startedAt: new Date(),
    });
    return this.raceRepo.save(race);
  }

  async stopRace(): Promise<RaceEntity | null> {
    const race = await this.findLatestRace();
    if (!race) {
      return null;
    }
    race.state = 'finished';
    race.stoppedAt = new Date();
    return this.raceRepo.save(race);
  }

  async settleRace(raceId: number): Promise<RaceEntity | null> {
    const race = await this.raceRepo.findOne({ where: { raceId: raceId } });
    if (!race) {
      return null;
    }
    race.settled = true;
    race.state = 'settled';
    return this.raceRepo.save(race);
  }
}
