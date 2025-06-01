import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('race_processes')
export class RaceProcessEntity {
  @PrimaryColumn()
  raceId: number;

  @Column()
  tick: number;

  @Column('simple-json')
  positions: { horseId: string; position: number }[];

  @Column('simple-json', { nullable: true })
  events: any[];
}
