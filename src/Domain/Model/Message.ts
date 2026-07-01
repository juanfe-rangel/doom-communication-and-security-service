export class Message{
    constructor(
        public messageId : string,
        public senderid : number,
        public content: string,
        public timestamp : Date, 
    ){}
       
}