import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';
import { ExceptionsFilter } from './exceptions.filter';
import { MetricsModule } from './metrics.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : {
                target: 'pino-pretty',
                options: { singleLine: true, colorize: true },
              },
        customProps: (req) => ({
          requestId: req?.headers?.['x-request-id'] || 'unknown',
        }),
        messageKey: 'message',
      },
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: false },
    }),
    MetricsModule,
  ],
  providers: [ExceptionsFilter],
  exports: [ExceptionsFilter],
})
export class APILoggerModule {}
