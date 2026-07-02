import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { RabbitConfig } from 'src/Infrastructure/Config/Rabbit/Rabbit.Config';
import amqp from 'amqplib';
import { RouteDeviationEvent } from '../Event/Alert/RouteDeviationEvent';
import { Alert } from 'src/Domain/Model/Alert';
import { randomUUID } from 'crypto';
import { AlertType } from 'src/Domain/Model/Enum/AlertType';
import { AlertStatus } from 'src/Domain/Model/Enum/AlertStatus';
import type { AlertRepository } from 'src/Domain/Repository/AlertRepository';
import { ALERT_PORTS } from 'src/Application/Ports/Out/AlertTokens';

@Injectable()
export class RouteDeviationListener implements OnApplicationBootstrap {
  private channel: amqp.Channel;

  constructor(
    private readonly rabbit: RabbitConfig,
    @Inject(ALERT_PORTS.AlertRepository)
    private readonly alertRepo: AlertRepository,
  ) {}

  private async initializeConfiguration() {
    await this.channel.assertExchange('localitation.exchange', 'topic', {
      durable: true,
    });

    await this.channel.assertQueue('route.deviation.queue', { durable: true });

    await this.channel.bindQueue(
      'route.deviation.queue',
      'localitation.exchange',
      'route.deviation',
    );
  }

  async onApplicationBootstrap() {
    try {
      this.channel = await this.rabbit.getChannel();

      await this.initializeConfiguration();
      await this.routeDeviationEvent();
    } catch (error) {
      console.error('Error conrabbit', error);
    }
  }

  private async routeDeviationEvent() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    await this.channel.consume('route.deviation.queue', async (msg) => {
      if (!msg) return;
      const event = JSON.parse(msg.content.toString()) as RouteDeviationEvent;

      const alert = new Alert(
        randomUUID(),
        event.travelId,
        AlertType.ROUTE_DEVIATION,
        AlertStatus.PENDING,
        new Date(),
        event.location,
      );

      this.alertRepo.save(alert);
      this.rabbit.publish(alert, 'alert.created');

      console.log(event);
      this.channel.ack(msg);
    });
  }
}
