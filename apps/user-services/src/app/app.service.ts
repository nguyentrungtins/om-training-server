import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ProducerService } from '../kafka/producer.service';

@Injectable()
export class AppService {
  constructor(
    @Inject('NOTI_SERVICE_KAFKA') private readonly notiClient: ClientKafka,
    private readonly producerService: ProducerService
  ) {}
  async helloUser() {
    await this.producerService.produce('hello_user', {
      value: 'Hello World'
    });
    return 'Hello World!';
  }
}
