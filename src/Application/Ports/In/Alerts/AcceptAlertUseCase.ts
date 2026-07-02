import { Alert } from 'src/Domain/Model/Alert';

export interface AcceptAlertUseCase {
  AcceptAlert(alertId: string, confirm: boolean): Promise<Alert>;
}
