import { Controller, Get, Response, UseInterceptors } from '@nestjs/common';
import { register } from 'prom-client';
import { AppService } from './app.service';
import { MetricsInterCeptor } from './util/metrics.interceptors';

@Controller()
@UseInterceptors(MetricsInterCeptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/world')
  getWorld(): string {
    return this.appService.getWorld();
  }

  @Get('/health')
  getHealth(): object {
    return { status: 'UP' };
  }

  @Get('/metrics')
  getMetrics(): Promise<string> {
    return register.metrics();
  }
}
