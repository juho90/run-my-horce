import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { Observable, tap } from 'rxjs';
import { normalizePath } from './path.util';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_server_duration_seconds')
    private readonly durationHist: Histogram<string>,
    @InjectMetric('http_server_requests_total')
    private readonly reqCounter: Counter<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const start = process.hrtime.bigint();
    return next.handle().pipe(
      tap({
        next: (_value) => {
          const res = context.switchToHttp().getResponse();
          const status = String(res.statusCode ?? 200);
          const method = req.method;
          const path = normalizePath(req.url || '/');
          const end = process.hrtime.bigint();
          const seconds = Number(end - start) / 1e9;
          this.durationHist.labels(method, path, status).observe(seconds);
          this.reqCounter.labels(method, path, status, 'true').inc();
        },
        error: (err) => {
          const res = context.switchToHttp().getResponse();
          const status = String(err?.status ?? res?.statusCode ?? 500);
          const method = req.method;
          const path = normalizePath(req.url || '/');
          const end = process.hrtime.bigint();
          const seconds = Number(end - start) / 1e9;
          this.durationHist.labels(method, path, status).observe(seconds);
          this.reqCounter.labels(method, path, status, 'false').inc();
        },
      }),
    );
  }
}
