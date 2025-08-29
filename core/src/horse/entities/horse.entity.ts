import { RaceHorseStatus } from 'engine/src/raceHorseStatus';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum HorseStatus {
  IDLE = 'idle',
  RACING = 'racing',
  RETIRED = 'retired',
}

@Entity('horses')
export class HorseEntity {
  @PrimaryColumn()
  raceId: number;

  @PrimaryColumn()
  horseId: number;

  @Column({ type: 'nvarchar', length: 50 })
  name: string;

  @Column({ default: 'VERSATILE', type: 'varchar', length: 20 })
  runningStyle: RaceHorseStatus['runningStyle'];

  @Column('int')
  strength: number;

  @Column('int')
  endurance: number;

  @Column('int')
  agility: number;

  @Column('int')
  intelligence: number;

  @Column('int')
  spirit: number;

  @Column({ default: 'idle', type: 'varchar', length: 8 })
  status: 'idle' | 'racing' | 'retired';
}
