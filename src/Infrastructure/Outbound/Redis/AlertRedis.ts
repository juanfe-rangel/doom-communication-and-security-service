import { Injectable } from '@nestjs/common';
import { Alert } from 'src/Domain/Model/Alert';
import { AlertRepository } from 'src/Domain/Repository/AlertRepository';
import { RedisConfig } from 'src/Infrastructure/Config/Redis/Redis.Config';

@Injectable()
export class AlertRedisCache implements AlertRepository {
  constructor(private readonly redis: RedisConfig) {}

  async save(alert: Alert): Promise<Alert> {
    console.log(alert);
    return this.persist(alert);
  }

  async findById(id: string): Promise<Alert> {
    const raw = await this.redis.get(this.alertKey(id));

    if (!raw) {
      throw new Error(`Alert not found: ${id}`);
    }

    const data = JSON.parse(raw);
    return AlertMapper.toDomain(data);
  }

  async update(alert: Alert): Promise<Alert> {
    try {
      const existing = await this.findById(alert.alertId);
      await this.removeIndexes(existing);
    } catch {}

    return this.persist(alert);
  }

  async deleteById(id: string): Promise<void> {
    try {
      const alert = await this.findById(id);
      await this.removeIndexes(alert);
    } catch {}

    await this.redis.del(this.alertKey(id));
  }

  private alertKey(alertId: string): string {
    return `alert:${alertId}`;
  }

  private travelKey(travelId: string): string {
    return `alert:travel:${travelId}`;
  }

  private async persist(alert: Alert): Promise<Alert> {
    await this.redis.set(this.alertKey(alert.alertId), JSON.stringify(alert));

    if (alert.travelid) {
      await this.redis.set(this.travelKey(alert.travelid), alert.alertId);
    }

    return alert;
  }

  private async removeIndexes(alert: Alert): Promise<void> {
    if (alert.travelid) {
      const currentAlertId = await this.redis.get(
        this.travelKey(alert.travelid),
      );
      if (currentAlertId === alert.alertId) {
        await this.redis.del(this.travelKey(alert.travelid));
      }
    }
  }
}

export class AlertMapper {
  static toDomain(data: any): Alert {
    return new Alert(
      data.alertId,
      data.travelid,
      data.alertType,
      data.alertStatus,
      new Date(data.CreatedAt),
      data.location,
    );
  }
}
