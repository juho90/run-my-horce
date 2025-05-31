import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('bets')
export class Bet {
  @PrimaryColumn()
  discordId: string;

  @PrimaryColumn()
  raceId: string;

  @Column()
  horseId: string;

  @Column('int')
  amount: number;

  @Column({ default: false })
  settled: boolean;
}
