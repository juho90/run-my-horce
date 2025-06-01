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

  async findLatestRace(): Promise<RaceEntity | null> {
    return this.raceRepo.findOne({
      where: {},
      order: { id: 'DESC' },
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
    const race = await this.raceRepo.findOne({ where: { id: raceId } });
    if (!race) {
      return null;
    }
    race.settled = true;
    race.state = 'settled'; // 필요시 상태 문자열도 변경
    return this.raceRepo.save(race);
  }
}
