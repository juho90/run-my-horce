import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [AuthModule, InventoryModule],
  controllers: [GatewayController],
})
export class GatewayModule {}
