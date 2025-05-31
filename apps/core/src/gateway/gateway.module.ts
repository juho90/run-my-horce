import { Module } from '@nestjs/common';
import { BettingModule } from 'src/betting/betting.module';
import { HorseModule } from 'src/horse/horse.module';
import { RaceModule } from 'src/race/race.module';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [HorseModule, RaceModule, BettingModule],
  controllers: [GatewayController],
})
export class GatewayModule {}
