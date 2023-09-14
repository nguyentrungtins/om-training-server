import { Injectable } from '@nestjs/common';
import { MessageDto } from '../message/message.dto';

@Injectable()
export class ConsumerService {
  getHello(message: MessageDto): void {
    console.log(message);
    console.log(`Hello ${message.value.toString()}`);
  }
}
