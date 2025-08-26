import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BettingEntity } from './entities/betting.entity';

@Injectable()
export class BettingService {
  constructor(
    @InjectRepository(BettingEntity)
    private readonly bettingRepo: Repository<BettingEntity>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findBetsByRaceId(raceId: number): Promise<BettingEntity[]> {
    return this.bettingRepo.find({ where: { raceId } });
  }

  async findBetsByHorseId(
    raceId: number,
    horseId: number,
  ): Promise<BettingEntity[]> {
    return this.bettingRepo.find({ where: { raceId, horseId } });
  }

  async placeBet({
    discordId,
    raceId,
    horseId,
    amount,
  }: Partial<BettingEntity>): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const betRepository = manager.getRepository(BettingEntity);
      const existing = await betRepository.findOne({
        where: { discordId, raceId },
      });
      if (existing) {
        throw new Error('이미 이 레이스에 베팅했습니다.');
      }
      const bet = betRepository.create({ discordId, raceId, horseId, amount });
      await betRepository.save(bet);
    });
  }

  async settleBet(raceId: number, winnerHorseId: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const betRepo = manager.getRepository(BettingEntity);
      const allBets = await betRepo.find({ where: { raceId, settled: false } });
      if (allBets.length === 0) {
        return;
      }
      await betRepo
        .createQueryBuilder()
        .update()
        .set({ settled: true })
        .where('raceId = :raceId', { raceId })
        .execute();
    });
  }
}
