import { Module } from '@nestjs/common';
import { CHAT_PORTS } from 'src/Application/Ports/Out/ChatTokens';
import { sendMessageImpl } from 'src/Application/Service/Chat/SendMessagesImpl';
import { RabbitConfig } from 'src/Infrastructure/Config/Rabbit/Rabbit.Config';
import { ChatSocketController } from 'src/Infrastructure/Inbound/Chat/ChatSocketController';
import { ChatRedisCache } from 'src/Infrastructure/Outbound/Redis/ChatRedis';
import { TravelCancelledListener } from 'src/Infrastructure/Outbound/Rabbit/TravelCancelledListener';
import { TravelCompletedListener } from 'src/Infrastructure/Outbound/Rabbit/TravelCompletedListener';
import { TravelCreatedListener } from 'src/Infrastructure/Outbound/Rabbit/TravelCreatedListener';
import { TravelPassengersUpdatedListener } from 'src/Infrastructure/Outbound/Rabbit/TravelPassengersUpdated';
import { TravelUpdatedListener } from 'src/Infrastructure/Outbound/Rabbit/TravelUpdatedListener';
import { ChatWebSocket } from 'src/Infrastructure/Outbound/WebSocket/ChatWebSocket';
import { ChatController } from 'src/Infrastructure/Inbound/Chat/ChatController';
import { GetMessageHistoryImpl } from 'src/Application/Service/Chat/GetMessageHistoryImpl';

@Module({
  controllers: [ChatController],
  providers: [
    RabbitConfig,
    ChatSocketController,
    TravelCreatedListener,
    TravelUpdatedListener,
    TravelPassengersUpdatedListener,
    TravelCompletedListener,
    TravelCancelledListener,
    {
      provide: CHAT_PORTS.SendMessageUseCase,
      useClass: sendMessageImpl,
    },
    {
      provide: CHAT_PORTS.ChatWs,
      useClass: ChatWebSocket,
    },
    {
      provide: CHAT_PORTS.ChatRepository,
      useClass: ChatRedisCache,
    },
    {
      provide: CHAT_PORTS.GetMessageHistoryUseCase,
      useClass: GetMessageHistoryImpl,
    },
  ],
  exports: [CHAT_PORTS.ChatRepository, RabbitConfig],
})
export class ChatModule {}
