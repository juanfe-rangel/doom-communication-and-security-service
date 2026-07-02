import { Inject, Injectable } from '@nestjs/common';
import { AcceptAlertUseCase } from 'src/Application/Ports/In/Alerts/AcceptAlertUseCase';
import { ALERT_PORTS } from 'src/Application/Ports/Out/AlertTokens';
import { Alert } from 'src/Domain/Model/Alert';
import type { AlertRepository } from 'src/Domain/Repository/AlertRepository';
import { AlertStatus } from 'src/Domain/Model/Enum/AlertStatus';

@Injectable()
export class ManageAlertImpl implements AcceptAlertUseCase {
  constructor(
    @Inject(ALERT_PORTS.AlertRepository)
    private readonly alertRepo: AlertRepository,
  ) {}

  async AcceptAlert(alertId: string, confirm: boolean): Promise<Alert> {
    const alert: Alert = await this.alertRepo.findById(alertId);
    if (confirm) {
      alert.alertStatus = AlertStatus.RESOLVED;
    } else {
      alert.alertStatus = AlertStatus.REJECTED;
    }
    this.alertRepo.deleteById(alertId);
    return alert;
  }
}
