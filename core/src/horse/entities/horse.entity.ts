import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('horses')
export class HorseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('int')
  speed: number;

  @Column('int')
  stamina: number;

  @Column('int')
  power: number;

  @Column({ default: 'idle' })
  status: 'idle' | 'racing' | 'retired';
}
