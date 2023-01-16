import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  collectDefaultMetrics,
  Counter,
  exponentialBuckets,
  Histogram,
  Summary,
} from 'prom-client';
import { Observable } from 'rxjs';

@Injectable()
export class MetricsInterCeptor implements NestInterceptor {
  private httpRequestsTotalCounter: Counter<string>;
  private httpServerRequestsSecondsHistogram: Histogram<string>;
  private httpRequestSizeBytesSummary: Summary<string>;
  private httpResponseSizeBytesSummary: Summary<string>;

  constructor() {
    collectDefaultMetrics();

    const labelNames = ['method', 'uri', 'code'];
    this.httpRequestsTotalCounter = new Counter({
      labelNames,
      name: 'nodejs_http_requests_total',
      help: 'Total number of HTTP requests',
    });

    this.httpRequestSizeBytesSummary = new Summary({
      labelNames,
      name: 'nodejs_http_request_size_bytes',
      help: 'Duration of HTTP requests size in bytes',
    });

    this.httpResponseSizeBytesSummary = new Summary({
      labelNames,
      name: 'nodejs_http_response_size_bytes',
      help: 'Duration of HTTP response size in bytes',
    });

    this.httpServerRequestsSecondsHistogram = new Histogram({
      labelNames,
      name: 'nodejs_http_server_requests_seconds',
      help: 'Duration of HTTP requests in seconds',
      buckets: exponentialBuckets(0.05, 1.3, 20),
    });
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const startEpoch = Date.now();
    const reponse = next.handle();

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    this.addHttpMetric(req, res, startEpoch);

    return reponse;
  }

  addHttpMetric(req: Request, res: Response, startEpoch: number) {
    const httpRequestMethod = req.method;
    const httpRequestPath = req.path;
    const httpResponseStatus = res.statusCode.toString();

    // TotalCount
    this.httpRequestsTotalCounter
      .labels(httpRequestMethod, httpRequestPath, httpResponseStatus)
      .inc();

    // Request Bytes
    if (req.headers['content-length']) {
      this.httpRequestSizeBytesSummary
        .labels(httpRequestMethod, httpRequestPath, httpResponseStatus)
        .observe(Number(req.headers['content-length']));
    }

    // Response Bytes
    if (res.getHeader('content-length')) {
      this.httpResponseSizeBytesSummary
        .labels(httpRequestMethod, httpRequestPath, httpResponseStatus)
        .observe(Number(res.getHeader('content-length')));
    }

    // Response Time
    this.httpServerRequestsSecondsHistogram
      .labels(httpRequestMethod, httpRequestPath, httpResponseStatus)
      .observe((Date.now() - startEpoch) / 1000);
  }
}
