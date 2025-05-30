import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HorseEntity } from '../horse/entities/horse.entity';
import { RaceEntity } from '../race/entities/race.entity';

@Entity('race_entries')
export class RaceEntryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RaceEntity)
  @JoinColumn({ name: 'race_id' })
  race: RaceEntity;

  @ManyToOne(() => HorseEntity)
  @JoinColumn({ name: 'horse_id' })
  horse: HorseEntity;

  @Column({ nullable: true })
  position: number;

  @Column({ nullable: true })
  time: number;
}
