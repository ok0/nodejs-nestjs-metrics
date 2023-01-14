import { Module } from '@nestjs/common';
import { ExampleAppController } from './example-app.controller';
import { ExampleAppService } from './example-app.service';

@Module({
  imports: [],
  controllers: [ExampleAppController],
  providers: [ExampleAppService],
})
export class ExampleAppModule {}
