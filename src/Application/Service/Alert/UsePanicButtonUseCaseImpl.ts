import { Inject, Injectable } from '@nestjs/common';
import { UsePanicButtonUseCase } from 'src/Application/Ports/In/Alerts/UsePanicButtonUseCase';
import { CHAT_PORTS } from 'src/Application/Ports/Out/ChatTokens';
import type { ChatRepository } from 'src/Domain/Repository/ChatRepository';
import {
  AlertButtonDTO,
  PanicButtonResponse,
} from 'src/Infrastructure/Inbound/Alert/AlertDTOS';

@Injectable()
export class UsePanicButtonUseImpl implements UsePanicButtonUseCase {
  constructor(
    @Inject(CHAT_PORTS.ChatRepository)
    private readonly chatRepository: ChatRepository,
  ) {}

  UsePanicButton(userId: number, dto: AlertButtonDTO): PanicButtonResponse {
    return new PanicButtonResponse('a');
  }
}
