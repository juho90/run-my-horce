import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RaceResultEntity } from './entities/race-result.entity';

@Injectable()
export class RaceResultService {
  constructor(
    @InjectRepository(RaceResultEntity)
    private readonly raceResultRepository: Repository<RaceResultEntity>,
  ) {}

  async findResultByRaceId(raceId: number) {
    return await this.raceResultRepository.findOne({
      where: { raceId },
    });
  }

  async createResult(raceResult: Partial<RaceResultEntity>) {
    const result = this.raceResultRepository.create(raceResult);
    return await this.raceResultRepository.save(result);
  }
}
