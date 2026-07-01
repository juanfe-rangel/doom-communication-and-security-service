import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import amqp from 'amqplib';
import { RabbitConfig } from 'src/Infrastructure/Config/Rabbit/Rabbit.Config';
import { TravelCancelledEvent } from './Event/TravelCancelledEvent';
import type { ChatRepository } from 'src/Domain/Repository/ChatRepository';
import { CHAT_PORTS } from 'src/Application/Ports/Out/ChatTokens';

@Injectable()
export class TravelCancelledListener implements OnApplicationBootstrap {
  private channel: amqp.Channel;

  constructor(
    private readonly rabbit: RabbitConfig,

    @Inject(CHAT_PORTS.ChatRepository)
    private readonly chatRepository: ChatRepository,
  ) {}

  private async initializeConfiguration() {
    await this.channel.assertExchange('travel.exchange', 'topic', {
      durable: true,
    });

    await this.channel.assertQueue('travel.cancelled.queue', { durable: true });

    await this.channel.bindQueue(
      'travel.cancelled.queue',
      'travel.exchange',
      'travel.cancelled',
    );
  }

  async onApplicationBootstrap() {
    try{
      this.channel = await this.rabbit.getChannel();

      await this.initializeConfiguration();
      await this.travelCancelledEvent();
    }catch (error) {
      console.error(
        'Error conrabbit',
        error.message
      );
    }
    
  }

  private async travelCancelledEvent() {
    this.channel.consume('travel.cancelled.queue', async (msg) => {
      if (!msg) return;

      const event = JSON.parse(msg.content.toString()) as TravelCancelledEvent;

      await this.chatRepository.deleteByTravelId(event.travelId);

      console.log(event);

      this.channel.ack(msg);
    });
  }
}
