import { PanicButtonResponse } from '../../../Infrastructure/Inbound/Alert/AlertDTOS';

export interface RabbitEventsPublisher {
  publishEmergencyAlert(event: PanicButtonResponse): void;
}
