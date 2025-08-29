import { Module } from '@nestjs/common';
import { BettingModule } from 'src/betting/betting.module';
import { HorseModule } from 'src/horse/horse.module';
import { RaceResultModule } from 'src/race-result/race-result.module';
import { RaceModule } from 'src/race/race.module';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [BettingModule, HorseModule, RaceModule, RaceResultModule],
  controllers: [GatewayController],
})
export class GatewayModule {}
