import { Module } from '@nestjs/common';
import { HorseModule } from '../horse/horse.module';
import { RaceModule } from '../race/race.module';
import { KafkaController } from './kafka.controller';

@Module({
  imports: [HorseModule, RaceModule],
  controllers: [KafkaController],
})
export class KafkaModule {}
