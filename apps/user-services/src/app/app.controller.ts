import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { MessagePattern, Transport } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'hello_user_tcp' }, Transport.TCP)
  // @Get('/hello')
  async sayHelloUser() {
    console.log('hey!! api-gateway just called me!!!');
    const result = await this.appService.helloUser();
    return {
      status: 'OK',
      code: 200,
      message: 'Get data success',
      data: result
    };
  }
}
