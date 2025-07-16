import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('races')
export class RaceEntity {
  @PrimaryGeneratedColumn()
  raceId: number;

  @Column({ default: 'pending' })
  state: string;

  @Column({ type: 'datetime', nullable: true })
  startedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  stoppedAt: Date;

  @Column({ default: false })
  settled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
