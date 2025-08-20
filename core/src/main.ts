import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { ExceptionsFilter } from './api-logger/exceptions.filter';
import { MetricsInterceptor } from './api-logger/metrics.interceptor';
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
        groupId: process.env.KAFKA_GROUP_ID || 'horse-core',
      },
    },
  });
  kafkaApp.useGlobalInterceptors(app.get(MetricsInterceptor));
  kafkaApp.useGlobalFilters(app.get(ExceptionsFilter));
  await kafkaApp.listen();
  Logger.log('Horse Core HTTP + Kafka Microservice is running');
  const config = new DocumentBuilder()
    .setTitle('Horse Racing Core API')
    .setDescription('Horse Racing Core API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'race'), {
    prefix: '/race/',
  });
  app.useGlobalInterceptors(app.get(MetricsInterceptor));
  app.useGlobalFilters(app.get(ExceptionsFilter));
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`);
  Logger.log(`Swagger documentation available at http://localhost:${port}/api`);
}
bootstrap();
