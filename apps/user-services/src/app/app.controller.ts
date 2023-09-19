import { Controller, Header } from '@nestjs/common';

import { AppService } from './app.service';
import { MessagePattern, Transport } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'hello_user_tcp' }, Transport.TCP)
  @Header('Content-Type', 'application/json')
  async create() {
    const result = await this.appService.helloUser();
    return result;
  }
}
