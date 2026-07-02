import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import amqp from 'amqplib';
import { RabbitConfig } from '../../../Config/Rabbit/Rabbit.Config';

import { RabbitEventsPublisher } from '../../../../Application/Ports/Out/RabbitEventsPublisher';
import { PanicButtonResponse } from 'src/Infrastructure/Inbound/Alert/AlertDTOS';

@Injectable()
export class UsePanicButtonPublisher
  implements OnApplicationBootstrap, RabbitEventsPublisher
{
  private channel: amqp.Channel;

  constructor(private readonly rabbit: RabbitConfig) {}

  async onApplicationBootstrap() {
    try {
      this.channel = await this.rabbit.getChannel();
      await this.initializeConfiguration();
    } catch (error) {
      console.error('Rabbit init error', error);
    }
  }

  private async initializeConfiguration() {
    await this.channel.assertExchange('security.exchange', 'topic', {
      durable: true,
    });

    await this.channel.assertQueue('route.deviation.queue', { durable: true });

    await this.channel.bindQueue(
      'emergency.created.queue',
      'security.exchange',
      'emergency.created',
    );
  }

  publishEmergencyAlert(event: PanicButtonResponse): void {
    this.channel.publish(
      'security.exchange',
      'emergency.created',
      Buffer.from(JSON.stringify(event)),
      { persistent: true },
    );
  }
}