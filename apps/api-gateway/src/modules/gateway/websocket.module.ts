import { Module } from '@nestjs/common';
import { WebSocketEventGateway } from './websocket';

@Module({
  providers: [WebSocketEventGateway],
  exports: [WebSocketEventGateway],
})
export class WebSocketGatewayModule {}
