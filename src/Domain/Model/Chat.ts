import { Message } from './Message';
import { User } from './User';

export class Chat {
  constructor(
    public chatId: string,
    public travelId: string,
    public driverId: number | null,
    public participants: User[],
    public active: boolean,
    public createdAt: Date,
    public messages: Message[],
  ) {}

  addMessage(m: Message) {
    this.messages.push(m);
  }

  getMessages() {
    return this.messages;
  }
}
