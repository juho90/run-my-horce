import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'horse-core',
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'], // 개발용
        },
        consumer: {
          groupId: 'horse-core-consumer',
        },
      },
    },
  );

  await app.listen();
  console.log('Horse Core Microservice is running');
}
bootstrap();
