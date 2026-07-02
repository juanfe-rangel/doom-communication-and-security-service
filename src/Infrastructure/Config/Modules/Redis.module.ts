import { Module, Global } from '@nestjs/common';
import { RedisConfig } from '../Redis/Redis.Config';

@Global()
@Module({
  providers: [RedisConfig],
  exports: [RedisConfig],
})
export class RedisModule {}
