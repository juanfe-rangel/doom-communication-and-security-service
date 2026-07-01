import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import amqp from 'amqplib';
import { RabbitConfig } from 'src/Infrastructure/Config/Rabbit/Rabbit.Config';
import { TravelPassengersUpdatedEvent } from './Event/TravelPassengersUpdatedEvent';
import type { ChatRepository } from 'src/Domain/Repository/ChatRepository';
import { CHAT_PORTS } from 'src/Application/Ports/Out/ChatTokens';

@Injectable()
export class TravelPassengersUpdatedListener implements OnApplicationBootstrap {
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

    await this.channel.assertQueue('travel.passengers.updated.queue', {
      durable: true,
    });

    await this.channel.bindQueue(
      'travel.passengers.updated.queue',
      'travel.exchange',
      'travel.passengers.updated',
    );
  }

  async onApplicationBootstrap() {
    try{
      this.channel = await this.rabbit.getChannel();

      await this.initializeConfiguration();
      await this.travelPassengersUpdatedEvent();
      
    }catch (error) {
      console.error(
        'Error conrabbit',
        error.message
      );
    }

    
  }

  private async travelPassengersUpdatedEvent() {
    this.channel.consume('travel.passengers.updated.queue', async (msg) => {
      if (!msg) return;

      const event = JSON.parse(
        msg.content.toString(),
      ) as TravelPassengersUpdatedEvent;

      await this.chatRepository.updatePassengersByTravelId(
        event.travelId,
        event.passengersId,
      );

      console.log(event);

      this.channel.ack(msg);
    });
  }
}
