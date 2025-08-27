import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { ExceptionsFilter } from './api-logger/exceptions.filter';
import { MetricsInterceptor } from './api-logger/metrics.interceptor';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const kafkaApp = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID || 'horse-user',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID || 'horse-user',
      },
    },
  });
  kafkaApp.useGlobalInterceptors(app.get(MetricsInterceptor));
  kafkaApp.useGlobalFilters(app.get(ExceptionsFilter));
  await kafkaApp.listen();
  const config = new DocumentBuilder()
    .setTitle('Horse Racing User API')
    .setDescription('Horse Racing User API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste JWT access token',
      },
      'accessToken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalInterceptors(app.get(MetricsInterceptor));
  app.useGlobalFilters(app.get(ExceptionsFilter));
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`);
  Logger.log(
    `Swagger documentation available at http://localhost:${port}/api-docs`,
  );
}
bootstrap();
