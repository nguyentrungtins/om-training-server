import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { decode } from 'next-auth/jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ cors: true })
export class WebSocketEventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleEmitSocket({ data, event, to }) {
    if (to) {
      // this.server.to(to.map((el) => String(el))).emit(event, data);
      this.server.to(to).emit(event, data);
    } else {
      this.server.emit(event, data);
    }
  }

  @SubscribeMessage('force-reload')
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    setTimeout(() => {
      this.server.to(socket.data.email).emit('message', data);
    }, 1000);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterInit(socket: Socket): any {}

  async handleConnection(socket: Socket) {
    console.log('connect', socket.id);
    const authHeader = socket.handshake.headers.authorization;
    console.log('authHeader: ', authHeader);
    if (authHeader && (authHeader as string).split(' ')[1]) {
      try {
        const token = (authHeader as string).split(' ')[1];
        const decoded = await decode({
          token: token,
          secret: 'nguyentrungtin',
        });
        if (!decoded) {
          throw new ForbiddenException();
        }

        socket.data.email = decoded?.email;

        socket.join(socket.data.email);
        console.log('connect success', socket.data.email);
      } catch (e) {
        console.log(e);
        socket.disconnect();
      }
    } else {
      socket.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnect', socket.id, socket.data?.email);
  }
}
