import { Body, Controller, Inject, Param, Patch, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { AcceptAlertUseCase } from 'src/Application/Ports/In/Alerts/AcceptAlertUseCase';
import { ALERT_PORTS } from 'src/Application/Ports/Out/AlertTokens';
import { AlertButtonDTO } from './AlertDTOS';
import type { UsePanicButtonUseCase } from '../../../Application/Ports/In/Alerts/UsePanicButtonUseCase';

@ApiTags('Alert')
@Controller('alerts')
export class AlertController {
  constructor(
    @Inject(ALERT_PORTS.manageAlert)
    private readonly manageAlertUseCase: AcceptAlertUseCase,
    @Inject(ALERT_PORTS.UsePanicButtonUseCase)
    private readonly usePanicButtonUseCase: UsePanicButtonUseCase,
  ) {}

  @Patch('manage/:id')
  manageAlert(@Param('id') id: string, @Body('confirm') confirm: boolean) {
    return this.manageAlertUseCase.AcceptAlert(id, confirm);
  }

  @Put('panic-button/:id')
  activePanicButton(@Param('id') userId: number, @Body() dto: AlertButtonDTO) {
    return this.usePanicButtonUseCase.UsePanicButton(userId, dto);
  }
}
