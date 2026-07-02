import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import amqp from 'amqplib';
import { RabbitConfig } from 'src/Infrastructure/Config/Rabbit/Rabbit.Config';
import { TravelCreatedEvent } from './Event/TravelCreatedEvent';
import { Chat } from 'src/Domain/Model/Chat';
import { User } from 'src/Domain/Model/User';
import { UserRole } from 'src/Domain/Model/Enum/UserRole';
import type { ChatRepository } from 'src/Domain/Repository/ChatRepository';
import { CHAT_PORTS } from 'src/Application/Ports/Out/ChatTokens';

@Injectable()
export class TravelCreatedListener implements OnApplicationBootstrap {
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

    await this.channel.assertQueue('travel.created.queue', { durable: true });

    await this.channel.bindQueue(
      'travel.created.queue',
      'travel.exchange',
      'travel.created',
    );
  }

  async onApplicationBootstrap() {
    try {
      this.channel = await this.rabbit.getChannel();

      await this.initializeConfiguration();
      await this.travelCreatedEvent();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('Error conrabbit', error.message);
    }
  }

  private async travelCreatedEvent() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    await this.channel.consume('travel.created.queue', async (msg) => {
      if (!msg) return;

      const event = JSON.parse(msg.content.toString()) as TravelCreatedEvent;

      const participants: User[] = event.passengersId.map((i) => {
        return new User(i, UserRole.PASSENGER);
      });

      const driver: User = new User(event.driverId, UserRole.DRIVER);
      participants.push(driver);

      const chat: Chat = new Chat(
        crypto.randomUUID(),
        event.travelId,
        event.driverId ?? null,
        participants,
        true,
        new Date(),
        [],
      );

      console.log(chat);
      await this.chatRepository.save(chat);

      console.log(event);

      this.channel.ack(msg);
    });
  }
}
