import { HorseEntity } from 'src/horse/entities/horse.entity';
import { RaceEntity } from 'src/race/entities/race.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
