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

  async findAllByUser(userId: string): Promise<InventoryEntity[]> {
    return this.repo.find({ where: { userId } });
  }

  async findOne(
    userId: string,
    itemId: string,
  ): Promise<InventoryEntity | null> {
    return this.repo.findOne({ where: { userId, itemId } });
  }

  async addItem(userId: string, itemId: string, amount: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(InventoryEntity);
      this.addItemRepo(userId, itemId, amount, repo);
    });
  }

  async addItemRepo(
    userId: string,
    itemId: string,
    amount: number,
    repo: Repository<InventoryEntity>,
  ): Promise<void> {
    const query = this.addItemQuery_SQLite(userId, itemId, amount);
    await repo.query(query);
  }

  private addItemQuery_SQLite(
    userId: string,
    itemId: string,
    amount: number,
  ): string {
    return `
      INSERT INTO inventories (userId, itemId, quantity)
      VALUES (${userId}, ${itemId}, ${amount})
      ON CONFLICT (userId, itemId)
      DO UPDATE SET quantity = quantity + ${amount}
    `;
  }

  private addItemQuery_MSSQL(
    userId: string,
    itemId: string,
    amount: number,
  ): string {
    return `
      MERGE inventories AS T
      USING (
        VALUES(${userId}, ${itemId}, ${amount})
      ) AS S (userId, itemId, quantity)
      ON T.userId = S.userId AND T.itemId = S.itemId
      WHEN MATCHED THEN
        UPDATE SET T.quantity = T.quantity + S.quantity
      WHEN NOT MATCHED BY TARGET THEN
        INSERT (userId, itemId, quantity)
        VALUES (S.userId, S.itemId, S.quantity)
    `;
  }

  async subItem(userId: string, itemId: string, amount: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(InventoryEntity);
      await this.subItemRepo(userId, itemId, amount, repo);
    });
  }

  async subItemRepo(
    userId: string,
    itemId: string,
    amount: number,
    repo: Repository<InventoryEntity>,
  ): Promise<void> {
    const existing = await repo.findOne({ where: { userId, itemId } });
    if (!existing || existing.quantity < amount) {
      throw new Error(`Not enough quantity of item: ${itemId}`);
    }
    await repo
      .createQueryBuilder()
      .update()
      .set({ quantity: () => `quantity - ${amount}` })
      .where('userId = :userId', { userId })
      .andWhere('itemId = :itemId', { itemId })
      .andWhere('quantity >= :amount', { amount })
      .setParameters({ userId, itemId, amount })
      .execute();
  }
}
