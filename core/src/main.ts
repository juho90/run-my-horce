import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const kafkaApp = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID || 'horse-core',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'horse-core-consumer',
      },
    },
  });
  await kafkaApp.listen();
  Logger.log('Horse Core HTTP + Kafka Microservice is running');
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'race'), {
    prefix: '/race/',
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
