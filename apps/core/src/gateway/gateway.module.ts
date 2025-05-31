import { Module } from '@nestjs/common';
import { HorseModule } from 'src/horse/horse.module';
import { RaceModule } from 'src/race/race.module';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [HorseModule, RaceModule],
  controllers: [GatewayController],
})
export class GatewayModule {}
