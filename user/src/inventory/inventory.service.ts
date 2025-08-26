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
      this.addItemRepo(discordId, itemId, amount, repo);
    });
  }

  async addItemRepo(
    discordId: string,
    itemId: string,
    amount: number,
    repo: Repository<InventoryEntity>,
  ): Promise<void> {
    const query = this.addItemQuery_SQLite(discordId, itemId, amount);
    await repo.query(query);
  }

  private addItemQuery_SQLite(
    discordId: string,
    itemId: string,
    amount: number,
  ): string {
    return `
      INSERT INTO inventories (discordId, itemId, quantity)
      VALUES (${discordId}, ${itemId}, ${amount})
      ON CONFLICT (discordId, itemId)
      DO UPDATE SET quantity = quantity + ${amount}
    `;
  }

  private addItemQuery_MSSQL(
    discordId: string,
    itemId: string,
    amount: number,
  ): string {
    return `
      MERGE inventories AS T
      USING (
        VALUES(${discordId}, ${itemId}, ${amount})
      ) AS S (discordId, itemId, quantity)
      ON T.discordId = S.discordId AND T.itemId = S.itemId
      WHEN MATCHED THEN
        UPDATE SET T.quantity = T.quantity + S.quantity
      WHEN NOT MATCHED BY TARGET THEN
        INSERT (discordId, itemId, quantity)
        VALUES (S.discordId, S.itemId, S.quantity)
    `;
  }

  async subItem(
    discordId: string,
    itemId: string,
    amount: number,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(InventoryEntity);
      await this.subItemRepo(discordId, itemId, amount, repo);
    });
  }

  async subItemRepo(
    discordId: string,
    itemId: string,
    amount: number,
    repo: Repository<InventoryEntity>,
  ): Promise<void> {
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
  }
}
