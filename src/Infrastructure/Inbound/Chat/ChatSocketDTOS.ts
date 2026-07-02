export class SendMessageDto {
  constructor(
    public content: string,
    public senderid: number,
  ) {}
}
