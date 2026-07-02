import { AlertStatus } from './Enum/AlertStatus';
import { AlertType } from './Enum/AlertType';
import { Location } from 'src/Domain/Model/Location';

export class Alert {
  constructor(
    public alertId: string,
    public travelid: string,
    public alertType: AlertType,
    public alertStatus: AlertStatus,
    public CreatedAt: Date,
    public location: Location,
  ) {}
}
