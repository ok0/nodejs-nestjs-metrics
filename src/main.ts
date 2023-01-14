import { NestFactory } from '@nestjs/core';
import { ExampleAppModule } from './example-app/example-app.module';
import { MetricsModule } from './metrics/metrics.module';

async function bootstrap() {
  const app = await NestFactory.create(ExampleAppModule);
  await app.listen(3000);

  const metricsApp = await NestFactory.create(MetricsModule);
  await metricsApp.listen(9090);
}
bootstrap();
