import { Inject, Injectable } from '@nestjs/common';
import { SendMessageUseCase } from 'src/Application/Ports/In/Chat/SendMessageUseCase';
import { CHAT_PORTS } from 'src/Application/Ports/Out/ChatTokens';
import type { ChatWs } from 'src/Application/Ports/Out/ChatWs';
import { Chat } from 'src/Domain/Model/Chat';
import { Message } from 'src/Domain/Model/Message';
import type { ChatRepository } from 'src/Domain/Repository/ChatRepository';

@Injectable()
export class sendMessageImpl implements SendMessageUseCase {
  constructor(
    @Inject(CHAT_PORTS.ChatWs) private readonly chatWs: ChatWs,
    @Inject(CHAT_PORTS.ChatRepository)
    private readonly chatRepository: ChatRepository,
  ) {}

  async sendMessage(content: string, senderid: number): Promise<void> {
    console.log(content, senderid);
    const chat: Chat = await this.chatRepository.findByParticipantId(senderid);

    const message = new Message(
      crypto.randomUUID(),
      senderid,
      content,
      new Date(),
    );
    chat.addMessage(message);

    await this.chatRepository.update(chat);

    this.chatWs.sendMessage(message, chat.chatId);
  }
}
