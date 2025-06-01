import { Module } from '@nestjs/common';
import { BettingModule } from 'src/betting/betting.module';
import { HorseModule } from 'src/horse/horse.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { RaceResultModule } from 'src/race-result/race-result.module';
import { RaceModule } from 'src/race/race.module';
import { KafkaController } from './kafka.controller';

@Module({
  imports: [
    HorseModule,
    RaceModule,
    BettingModule,
    InventoryModule,
    RaceResultModule,
  ],
  controllers: [KafkaController],
})
export class KafkaModule {}
