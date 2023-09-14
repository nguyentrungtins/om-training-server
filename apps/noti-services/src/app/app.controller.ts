import { Controller, Get, HttpStatus } from '@nestjs/common';

import { AppService } from './app.service';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly usersService: AppService) {}

  @MessagePattern('users.userCreation', Transport.KAFKA)
  async helloUser(@Payload() signupData: any) {
    try {
      return await this.usersService
        .helloUser(signupData)
        .then(() => {
          return {
            status: HttpStatus.OK,
            message: 'You have successfully registered.',
          };
        })
        .catch(() => {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Inavlid details provided!',
          };
        });
    } catch {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Inavlid details provided!',
      };
    }
  }
}
