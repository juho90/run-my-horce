import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // admin에서 호출 허용 (개발용)
  await app.listen(process.env.PORT || 3000);
  const kafkaApp = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'horse-core',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'horse-core-consumer',
      },
    },
  });
  await kafkaApp.listen();
  console.log('Horse Core HTTP + Kafka Microservice is running');
}
bootstrap();
