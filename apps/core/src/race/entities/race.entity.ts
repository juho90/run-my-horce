import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('races')
export class RaceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'waiting' })
  state: 'waiting' | 'started' | 'finished';

  @CreateDateColumn()
  started_at: Date;

  @UpdateDateColumn({ nullable: true })
  ended_at: Date;
}
