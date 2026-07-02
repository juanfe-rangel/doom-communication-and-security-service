import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import amqp from 'amqplib';
import 'dotenv/config';

const EXCHANGE = 'security.exchange';
const QUEUES = [
  { name: 'alert.created.queue', routingKey: 'alert.created' },
  { name: 'emergency.created.queue', routingKey: 'emergency.created' },
];

@Injectable()
export class RabbitConfig implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.ChannelModel;
  private channel: amqp.Channel;
  private readonly ready: Promise<void>;
  private readonly logger = new Logger(RabbitConfig.name);

  constructor() {
    this.ready = this.connect();
  }

  private async connect() {
    try {
      const url = process.env.RABBITMQ_URL ?? 'amqp://localhost';

      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(EXCHANGE, 'topic', { durable: true });

      for (const { name, routingKey } of QUEUES) {
        await this.channel.assertQueue(name, { durable: true });
        await this.channel.bindQueue(name, EXCHANGE, routingKey);
      }
    } catch (error) {
      console.error('Error conrabbit', error);
    }
  }

  publish(event: object, routingKey: string): void {
    if (!this.channel) {
      this.logger.warn(`RabbitMQ unavailable — skipping event [${routingKey}]`);
      return;
    }
    this.channel.publish(
      EXCHANGE,
      routingKey,
      Buffer.from(JSON.stringify(event)),
      { contentType: 'application/json', persistent: true },
    );
  }

  async onModuleInit() {
    await this.ready;
  }

  async getChannel() {
    await this.ready;
    return this.channel;
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
