export interface SendMessageUseCase{
    sendMessage(message : string,senderId:number):void;
}