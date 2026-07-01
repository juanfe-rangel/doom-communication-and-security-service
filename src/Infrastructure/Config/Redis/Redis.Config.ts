import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import 'dotenv/config';

@Injectable()
export class RedisConfig implements OnModuleDestroy {

  private readonly client: Redis;

  constructor() {
    console.log(process.env.REDIS_HOST)
    console.log(process.env.REDIS_PORT)
    console.log(Number(process.env.REDIS_PORT))
    console.log(process.env.REDIS_PASSWORD)

    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,

      tls: {}, 
    });

    this.client.on('connect', () => {
      console.log('Redis conectado');
    });

    this.client.on('error', (error) => {
      console.error('Redis error:', error);
    });
  }


  async set(key: string,value: string, ttl?: number) {
    if (ttl) {
      return this.client.set(
        key,
        value,
        'EX',
        ttl
      );
    }

    return this.client.set(
      key,
      value
    );
  }


  async get(key: string) {
    return this.client.get(key);
  }


  async del(key: string) {
    return this.client.del(key);
  }


  async onModuleDestroy() {
    await this.client.quit();
  }
}