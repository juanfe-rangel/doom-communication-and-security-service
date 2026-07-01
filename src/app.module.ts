import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './Infrastructure/Config/Modules/Chat.module';
import { RedisModule } from './Infrastructure/Config/Modules/Redis.module';

@Module({
  imports: [
    ChatModule,
    RedisModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
