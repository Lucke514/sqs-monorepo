export class Message {
    private constructor(
        public readonly type: string,
        public readonly data: Record<string, unknown>,
        public readonly messageId: string,
        public readonly receiveCount: number,
    ) {}

    static create(
        type: string,
        data: Record<string, unknown>,
        messageId: string,
        receiveCount: number,
    ): Message {
        return new Message(type, data, messageId, receiveCount);
    }

    get isRedelivery(): boolean {
        return this.receiveCount > 1;
    }
}
