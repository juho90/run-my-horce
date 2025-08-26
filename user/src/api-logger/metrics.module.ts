import { Module } from '@nestjs/common';
import {
  PrometheusModule,
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';
import { MetricsInterceptor } from './metrics.interceptor';

@Module({
  imports: [PrometheusModule.register({ defaultMetrics: { enabled: true } })],
  providers: [
    makeCounterProvider({
      name: 'http_server_requests_total',
      help: 'HTTP requests count',
      labelNames: ['method', 'path', 'status', 'success'],
    }),
    makeHistogramProvider({
      name: 'http_server_duration_seconds',
      help: 'HTTP request duration seconds',
      labelNames: ['method', 'path', 'status'],
      buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    }),
    makeCounterProvider({
      name: 'http_server_errors_total',
      help: 'HTTP server errors',
      labelNames: ['method', 'path', 'status', 'name'],
    }),
    MetricsInterceptor,
  ],
  exports: [
    makeCounterProvider({
      name: 'http_server_errors_total',
      help: 'HTTP server errors',
      labelNames: ['method', 'path', 'status', 'name'],
    }),
    MetricsInterceptor,
  ],
})
export class MetricsModule {}
