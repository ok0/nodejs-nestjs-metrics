import { Injectable } from '@nestjs/common';

@Injectable()
export class ExampleAppService {
  getHello(): string {
    return 'Hello World!';
  }

  getWorld(): string {
    return 'World Hello!';
  }
}
