import { Message } from "src/Domain/Model/Message";

export interface GetMessageHistoryUseCase{
    GetMessageHistory(travelId:string): Promise<Message[]>;
}