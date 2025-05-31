import { Module } from '@nestjs/common';
import { HorseModule } from 'src/horse/horse.module';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [HorseModule],
  controllers: [GatewayController],
})
export class GatewayModule {}
