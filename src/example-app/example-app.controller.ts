import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ExampleAppService } from './example-app.service';
import { MetricsInterCeptor } from '../util/metrics.interceptors';

@Controller()
@UseInterceptors(MetricsInterCeptor)
export class ExampleAppController {
  constructor(private readonly exampleAppService: ExampleAppService) {}

  @Get('/hello')
  getHello(): string {
    return this.exampleAppService.getHello();
  }

  @Get('/world')
  getWorld(): string {
    return this.exampleAppService.getWorld();
  }
}
