// src/inventories/inventory.service.ts

import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { InventoryEntity } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryEntity)
    private readonly repo: Repository<InventoryEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAllByUser(discordId: string): Promise<InventoryEntity[]> {
    return this.repo.find({ where: { discordId } });
  }

  async findOne(
    discordId: string,
    itemId: string,
  ): Promise<InventoryEntity | null> {
    return this.repo.findOne({ where: { discordId, itemId } });
  }

  async addItem(
    discordId: string,
    itemId: string,
    amount: number,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(InventoryEntity);
      const existing = await repo.findOne({ where: { discordId, itemId } });
      if (existing) {
        await repo
          .createQueryBuilder()
          .update()
          .set({ quantity: () => `quantity + ${amount}` })
          .where('discordId = :discordId', { discordId })
          .andWhere('itemId = :itemId', { itemId })
          .execute();
      } else {
        await repo.insert({ discordId, itemId, quantity: amount });
      }
    });
  }

  async subtractItem(
    discordId: string,
    itemId: string,
    amount: number,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(InventoryEntity);
      const existing = await repo.findOne({ where: { discordId, itemId } });
      if (!existing || existing.quantity < amount) {
        throw new Error(`Not enough quantity of item: ${itemId}`);
      }
      await repo
        .createQueryBuilder()
        .update()
        .set({ quantity: () => `quantity - ${amount}` })
        .where('discordId = :discordId', { discordId })
        .andWhere('itemId = :itemId', { itemId })
        .andWhere('quantity >= :amount', { amount })
        .setParameters({ discordId, itemId, amount })
        .execute();
    });
  }
}
