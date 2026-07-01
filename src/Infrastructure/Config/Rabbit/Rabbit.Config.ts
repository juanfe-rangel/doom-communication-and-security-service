import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import amqp from 'amqplib';


@Injectable()
export class RabbitConfig implements OnModuleInit, OnModuleDestroy {
    private connection: amqp.ChannelModel;
    private channel: amqp.Channel;
    private readonly ready: Promise<void>;

    constructor() {
      this.ready = this.connect();
    }

    private async connect() {
      try{
        const url = process.env.RABBITMQ_URL ?? 'amqp://localhost';

        this.connection = await amqp.connect(url);
        this.channel = await this.connection.createChannel();
      }catch(error){
        console.error(
          'Error conrabbit',
          error.message
        );
      }
      
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
