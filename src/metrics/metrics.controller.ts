import { Controller, Get, Header } from '@nestjs/common';
import { register } from 'prom-client';

@Controller()
export class MetricsController {
  @Get('/health')
  getHealth(): object {
    return { status: 'UP' };
  }

  @Get('/metrics')
  @Header('Content-Type', register.contentType)
  getMetrics(): Promise<string> {
    return register.metrics();
  }
}
