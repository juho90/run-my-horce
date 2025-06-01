import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('inventories')
export class InventoryEntity {
  @PrimaryColumn()
  discordId: string;

  @PrimaryColumn()
  itemId: string;

  @Column('int', { default: 0 })
  quantity: number;
}
