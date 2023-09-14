import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async helloUser(createUserDto: any) {
    console.log('Users::createUser');
    return 'alo';
  }
}
