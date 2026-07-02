import { Alert } from '../Model/Alert';

export interface AlertRepository {
  save(alert: Alert): Promise<Alert>;
  findById(id: string): Promise<Alert>;
  update(alert: Alert): Promise<Alert>;
  deleteById(id: string): Promise<void>;
}
