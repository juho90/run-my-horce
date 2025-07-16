import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('horses')
export class HorseEntity {
  @PrimaryColumn()
  raceId: number;

  @PrimaryColumn()
  horseId: number;

  @Column('int')
  name: string;

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

  @Column({ default: 'idle' })
  status: 'idle' | 'racing' | 'retired';
}
