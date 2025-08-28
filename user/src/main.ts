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
  const metrics = app.get(MetricsInterceptor);
  const exceptions = app.get(ExceptionsFilter);
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
  kafkaApp.useGlobalInterceptors(metrics);
  kafkaApp.useGlobalFilters(exceptions);
  try {
    await kafkaApp.listen();
  } catch (error) {
    console.error(`Failed to start Kafka microservice: ${error.message}`);
    process.exit(1);
  }
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
  app.useGlobalInterceptors(metrics);
  app.useGlobalFilters(exceptions);
  const port = process.env.PORT || 3000;
  try {
    await app.listen(port);
  } catch (error) {
    console.error(`Failed to start HTTP server: ${error.message}`);
    process.exit(1);
  }
  Logger.log(`Server running on http://localhost:${port}`);
  Logger.log(
    `Swagger documentation available at http://localhost:${port}/api-docs`,
  );
}
bootstrap();
