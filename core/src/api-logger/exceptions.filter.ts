import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Counter } from 'prom-client';
import { normalizePath } from 'src/api-logger/path.util';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  constructor(
    @InjectPinoLogger(ExceptionsFilter.name)
    private readonly logger: PinoLogger,
    @InjectMetric('http_server_errors_total')
    private readonly errorCounter: Counter<string>,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    let name: string;
    let status: number;
    let message: string;
    if (exception instanceof HttpException) {
      name = exception.name;
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof Error) {
      name = exception.name;
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
    } else {
      name = 'Error';
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
    }

    let stack: string | undefined = undefined;
    if (process.env.NODE_ENV !== 'production') {
      if (exception instanceof HttpException) {
        stack = exception.stack;
      } else if (exception instanceof Error) {
        stack = exception.stack;
      }
    }

    const payload = {
      requestId: res?.get('x-request-id'),
      method: req?.method,
      path: normalizePath(req?.url || '/'),
      name,
      status,
      message,
      stack,
    };

    this.logger.error(payload);

    this.errorCounter
      .labels(payload.method, payload.path, String(status), payload.name)
      .inc();

    res.status(status).json({
      statusCode: status,
      error: payload.name,
      message: payload.message,
      requestId: payload.requestId,
    });
  }
}
