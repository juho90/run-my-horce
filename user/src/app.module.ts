import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APILoggerModule } from './api-logger/api-logger.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtService } from './auth/jwt.service';
import { GatewayModule } from './gateway/gateway.module';
import { JwtMiddleware } from './middlewares/jwt.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'user.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 개발용. 운영에서는 false
      logging: true,
    }),
    APILoggerModule,
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'api/auth', method: RequestMethod.ALL },
        { path: 'api/health-error', method: RequestMethod.ALL },
        { path: 'api-docs', method: RequestMethod.ALL },
        { path: 'metrics', method: RequestMethod.ALL },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
