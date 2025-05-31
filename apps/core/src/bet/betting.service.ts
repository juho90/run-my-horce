import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { ITEM_IDS } from 'src/inventory/inventory.constants';
import { DataSource, Repository } from 'typeorm';
import { Bet } from './entities/bet.entity';

@Injectable()
export class BettingService {
  constructor(
    @InjectRepository(Bet)
    private readonly betRepo: Repository<Bet>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getBetsByRace(raceId: string): Promise<Bet[]> {
    return this.betRepo.find({ where: { raceId } });
  }

  async getBetsByHorse(raceId: string, horseId: string): Promise<Bet[]> {
    return this.betRepo.find({ where: { raceId, horseId } });
  }

  async placeBet(
    discordId: string,
    raceId: string,
    horseId: string,
    amount: number,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const betRepository = manager.getRepository(Bet);
      const inventoryRepository = manager.getRepository(Inventory);
      const existing = await betRepository.findOne({
        where: { discordId, raceId },
      });
      if (existing) {
        throw new Error('이미 이 레이스에 베팅했습니다.');
      }
      const item = await inventoryRepository.findOne({
        where: { discordId, itemId: ITEM_IDS.COIN },
      });
      if (!item || item.quantity < amount) {
        throw new Error('코인이 부족합니다.');
      }
      await inventoryRepository
        .createQueryBuilder()
        .update()
        .set({ quantity: () => `quantity - ${amount}` })
        .where(
          'discordId = :discordId AND itemId = :itemId AND quantity >= :amount',
          {
            discordId,
            itemId: ITEM_IDS.COIN,
            amount,
          },
        )
        .execute();

      const bet = betRepository.create({ discordId, raceId, horseId, amount });
      await betRepository.save(bet);
    });
  }

  async payoutBet(raceId: string, winnerHorseId: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const betRepo = manager.getRepository(Bet);
      const inventoryRepo = manager.getRepository(Inventory);
      const allBets = await betRepo.find({ where: { raceId, settled: false } });
      if (allBets.length === 0) {
        return;
      }
      const totalBetAmount = allBets.reduce((sum, bet) => sum + bet.amount, 0);
      const winnerBets = allBets.filter((bet) => bet.horseId === winnerHorseId);
      const winnerTotal = winnerBets.reduce((sum, bet) => sum + bet.amount, 0);
      if (winnerTotal === 0) {
        console.warn(`🏁 레이스 ${raceId}: 당첨자 없음`);
        // 혹시 모를 보정이나 운영자 대응 로직 여기에
      } else {
        for (const bet of winnerBets) {
          const payout = Math.floor(
            (bet.amount / winnerTotal) * totalBetAmount,
          );
          // 기존 인벤토리 확인
          const existing = await inventoryRepo.findOne({
            where: { discordId: bet.discordId, itemId: ITEM_IDS.COIN },
          });
          if (existing) {
            await inventoryRepo
              .createQueryBuilder()
              .update()
              .set({ quantity: () => `quantity + ${payout}` })
              .where('discordId = :discordId AND itemId = :itemId', {
                discordId: existing.discordId,
                itemId: existing.itemId,
              })
              .execute();
          } else {
            await inventoryRepo.insert({
              discordId: bet.discordId,
              itemId: ITEM_IDS.COIN,
              quantity: payout,
            });
          }
        }
      }
      await betRepo
        .createQueryBuilder()
        .update()
        .set({ settled: true })
        .where('raceId = :raceId', { raceId })
        .execute();
    });
  }

  async markAsSettled(raceId: string): Promise<void> {
    await this.betRepo
      .createQueryBuilder()
      .update()
      .set({ settled: true })
      .where('raceId = :raceId', { raceId })
      .execute();
  }
}
