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
  const metrics = app.get(MetricsInterceptor);
  const exceptions = app.get(ExceptionsFilter);
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
  kafkaApp.useGlobalInterceptors(metrics);
  kafkaApp.useGlobalFilters(exceptions);
  try {
    await kafkaApp.listen();
  } catch (error) {
    console.error(`Failed to start Kafka microservice: ${error.message}`);
    process.exit(1);
  }
  Logger.log('Horse Core HTTP + Kafka Microservice is running');
  const config = new DocumentBuilder()
    .setTitle('Horse Racing Core API')
    .setDescription('Horse Racing Core API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'race'), {
    prefix: '/race/',
  });
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
