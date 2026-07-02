import {
  AlertButtonDTO,
  PanicButtonResponse,
} from 'src/Infrastructure/Inbound/Alert/AlertDTOS';

export interface UsePanicButtonUseCase {
  UsePanicButton(userId: number, dto: AlertButtonDTO): PanicButtonResponse;
}
