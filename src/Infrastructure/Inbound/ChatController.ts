import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import type { GetMessageHistoryUseCase } from "src/Application/Ports/In/GetMessageHistoryUseCase";
import { CHAT_PORTS } from "src/Application/Ports/Out/ChatTokens";
import { Chat } from "src/Domain/Model/Chat";
import { UserRole } from "src/Domain/Model/Enum/UserRole";
import { Message } from "src/Domain/Model/Message";
import { User } from "src/Domain/Model/User";
import type { ChatRepository } from "src/Domain/Repository/ChatRepository";

@ApiTags('Chat')
@Controller('chat')
export class ChatController{

    constructor(
      @Inject(CHAT_PORTS.GetMessageHistoryUseCase)
      private readonly getMessageHistoryUseCase : GetMessageHistoryUseCase,

      @Inject(CHAT_PORTS.ChatRepository)
      private readonly repo : ChatRepository
    ){}


    @Get('messages')
    @ApiQuery({
      name: 'travelId',
      type: String,
      required: true,
    })
    getMessageHistory( @Query('travelId') travelId: string ):Promise<Message[]>{
        return this.getMessageHistoryUseCase.GetMessageHistory(travelId);
        
    }


    @Post("test/:test")
    crearChat(@Param("test") test:string){

      const participants : User[] = [{userId:200,userRole:UserRole.DRIVER},{userId:300,userRole:UserRole.PASSENGER}]

      const chat : Chat= new Chat(
        crypto.randomUUID(),
        test,
        100,
        participants,
        true,
        new Date(),
        [],
      );
      this.repo.save(chat)
    }
}