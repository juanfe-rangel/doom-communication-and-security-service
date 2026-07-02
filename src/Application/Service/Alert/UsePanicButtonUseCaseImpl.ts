import { Inject, Injectable } from '@nestjs/common';
import { UsePanicButtonUseCase } from 'src/Application/Ports/In/Alerts/UsePanicButtonUseCase';

import {
  AlertButtonDTO,
  PanicButtonResponse,
} from 'src/Infrastructure/Inbound/Alert/AlertDTOS';
import { ALERT_PORTS } from '../../Ports/Out/AlertTokens';
import type { RabbitEventsPublisher } from '../../Ports/Out/RabbitEventsPublisher';

@Injectable()
export class UsePanicButtonUseImpl implements UsePanicButtonUseCase {
  constructor(
    @Inject(ALERT_PORTS.RabbitButtonPublisher)
    private readonly rabbitPublisher: RabbitEventsPublisher,
  ) {}

  UsePanicButton(userId: number, dto: AlertButtonDTO): PanicButtonResponse {
    const response: PanicButtonResponse = {
      content: 'Ocurrio una emergencia',
      location: dto.location,
      travelId: dto.travelId,
      userId: userId,
      contact: dto.contact,
    };

    this.rabbitPublisher.publishEmergencyAlert(response);
    return response;
  }
}
