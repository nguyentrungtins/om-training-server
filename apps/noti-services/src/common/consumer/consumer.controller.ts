import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConsumerService } from './consumer.service';
import { ParseMessagePipe } from '../message/parse-message.pipe';

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @MessagePattern('noti')
  getHello(@Payload(new ParseMessagePipe()) message): void {
    return this.consumerService.getHello(message);
  }
}
