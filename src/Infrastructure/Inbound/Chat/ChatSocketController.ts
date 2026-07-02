import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { SendMessageUseCase } from 'src/Application/Ports/In/Chat/SendMessageUseCase';
import { CHAT_PORTS } from 'src/Application/Ports/Out/ChatTokens';
import { Socket, Server } from 'Socket.io';
import { ChatWebSocket } from '../../Outbound/WebSocket/ChatWebSocket';
import { SendMessageDto } from './ChatSocketDTOS';

@WebSocketGateway()
export class ChatSocketController {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(CHAT_PORTS.SendMessageUseCase)
    private readonly sendMessageUseCase: SendMessageUseCase,

    @Inject(CHAT_PORTS.ChatWs)
    private readonly chatWs: ChatWebSocket,
  ) {}

  afterInit(server: Server) {
    this.chatWs.setServer(server);
  }

  @SubscribeMessage('chat:EnterRoom')
  enterRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
    console.log(`Cliente ${client.id} entró a ${room}`);
  }

  @SubscribeMessage('chat:sendMessage')
  async sendMessage(
    @MessageBody() message: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (!(message instanceof SendMessageDto)) {
      const obj = JSON.parse(message);
      await this.sendMessageUseCase.sendMessage(obj.content, obj.senderid);
      return;
    }

    await this.sendMessageUseCase.sendMessage(
      message.content,
      message.senderid,
    );
  }
}
