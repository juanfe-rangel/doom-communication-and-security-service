import { Inject, Injectable } from '@nestjs/common';
import { GetMessageHistoryUseCase } from 'src/Application/Ports/In/Chat/GetMessageHistoryUseCase';
import type { ChatRepository } from 'src/Domain/Repository/ChatRepository';
import { CHAT_PORTS } from 'src/Application/Ports/Out/ChatTokens';
import { Message } from 'src/Domain/Model/Message';
import { Chat } from 'src/Domain/Model/Chat';

@Injectable()
export class GetMessageHistoryImpl implements GetMessageHistoryUseCase {
  constructor(
    @Inject(CHAT_PORTS.ChatRepository)
    private readonly chatRepository: ChatRepository,
  ) {}

  async GetMessageHistory(travelId: string): Promise<Message[]> {
    const chat: Chat = await this.chatRepository.findByTravelId(travelId);
    return chat.getMessages();
  }
}
