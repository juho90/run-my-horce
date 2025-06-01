import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('bettings')
export class BettingEntity {
  @PrimaryColumn()
  discordId: string;

  @PrimaryColumn()
  raceId: number;

  @Column()
  horseId: number;

  @Column('int')
  amount: number;

  @Column({ default: false })
  settled: boolean;
}
