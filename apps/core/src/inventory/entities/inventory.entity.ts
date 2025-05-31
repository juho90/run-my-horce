import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('inventories')
export class Inventory {
  @PrimaryColumn()
  discordId: string;

  @PrimaryColumn()
  itemId: string;

  @Column('int', { default: 0 })
  quantity: number;
}
