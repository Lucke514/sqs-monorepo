export class Message {
    private constructor(
        public readonly type: string,
        public readonly data: any,
    ) {}

    static create(type: string, data: any): Message {
        return new Message(type, data);
    }
}