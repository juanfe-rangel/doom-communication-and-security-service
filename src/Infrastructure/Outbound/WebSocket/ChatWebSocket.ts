import { Inject, Injectable } from '@nestjs/common';
import { CHAT_PORTS } from 'src/Application/Ports/Out/ChatTokens';
import { ChatWs } from 'src/Application/Ports/Out/ChatWs';
import { ChatSocketController } from 'src/Infrastructure/Inbound/Chat/ChatSocketController';
import { Server } from 'socket.io';
import { Message } from 'src/Domain/Model/Message';

@Injectable()
export class ChatWebSocket implements ChatWs {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  sendMessage(message: Message, room: string): void {
    this.server.to(room).emit('chat:newMessage', message);
    console.log(message);
  }
}
