import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { ExceptionsFilter } from './api-logger/exceptions.filter';
import { MetricsInterceptor } from './api-logger/metrics.interceptor';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Horse Racing User API')
    .setDescription('Horse Racing User API Documentation')
    .setVersion('1.0')
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
