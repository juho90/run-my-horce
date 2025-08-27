import { Module } from '@nestjs/common';
import { InventoryModule } from 'src/inventory/inventory.module';
import { KafkaController } from './kafka.controller';

@Module({
  imports: [InventoryModule],
  controllers: [KafkaController],
})
export class KafkaModule {}
