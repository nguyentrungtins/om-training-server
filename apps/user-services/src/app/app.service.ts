import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices/client';

@Injectable()
export class AppService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: ClientKafka
  ) {}
  async onApplicationShutdown() {
    await this.usersService.close();
  }
  async onModuleInit() {
    const requestPatterns = ['users.userCreation'];
    requestPatterns.forEach((pattern) => {
      this.usersService.subscribeToResponseOf(pattern);
    });
    await this.usersService.connect();
  }
  async helloUser() {
    return await new Promise<any>((resolve) =>
      this.usersService.send('users.userCreation', 'alo').subscribe((data) => {
        console.log(data);
        resolve(data);
      })
    );
  }
}
