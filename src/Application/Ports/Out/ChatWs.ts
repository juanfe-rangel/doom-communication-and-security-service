import { Message } from "src/Domain/Model/Message";

export interface ChatWs{
    sendMessage(message:Message,room:string) :void;
    
}