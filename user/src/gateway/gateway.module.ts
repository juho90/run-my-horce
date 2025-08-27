import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { AuthModule } from 'src/auth/auth.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { GatewayController } from './gateway.controller';
import { KafkaProducerService } from './kafka.producer.service';

dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_PRODUCER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_CLIENT_ID || 'horse-user',
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID || 'horse-user-group',
          },
          producer: {},
        },
      },
    ]),
    AuthModule,
    InventoryModule,
  ],
  controllers: [GatewayController],
  providers: [KafkaProducerService],
})
export class GatewayModule {}
