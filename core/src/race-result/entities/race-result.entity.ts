import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('race_results')
export class RaceResultEntity {
  @PrimaryColumn()
  raceId: number;

  @Column()
  winnerHorseId: number;

  @Column('simple-json')
  ranking: number[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
